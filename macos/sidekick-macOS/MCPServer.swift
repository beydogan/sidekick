import Foundation
import Network

@objc(MCPServer)
class MCPServer: RCTEventEmitter {

  private var listener: NWListener?
  private var connections: [NWConnection] = []
  private var port: UInt16 = 3000
  private var isRunning = false

  override init() {
    super.init()
  }

  @objc override static func requiresMainQueueSetup() -> Bool {
    return false
  }

  override func supportedEvents() -> [String]! {
    return ["onRequest", "onError", "onServerStarted", "onServerStopped"]
  }

  @objc(start:resolver:rejecter:)
  func start(_ portNumber: NSNumber, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {

    if isRunning {
      reject("ALREADY_RUNNING", "Server is already running", nil)
      return
    }

    port = portNumber.uint16Value

    do {
      let params = NWParameters.tcp
      params.allowLocalEndpointReuse = true

      listener = try NWListener(using: params, on: NWEndpoint.Port(rawValue: port)!)

      listener?.stateUpdateHandler = { [weak self] state in
        switch state {
        case .ready:
          self?.isRunning = true
          self?.sendEvent(withName: "onServerStarted", body: ["port": self?.port ?? 0])
          resolve(["port": self?.port ?? 0])
        case .failed(let error):
          self?.isRunning = false
          reject("START_FAILED", "Failed to start server: \(error)", error)
        case .cancelled:
          self?.isRunning = false
          self?.sendEvent(withName: "onServerStopped", body: nil)
        default:
          break
        }
      }

      listener?.newConnectionHandler = { [weak self] connection in
        self?.handleConnection(connection)
      }

      listener?.start(queue: .global(qos: .userInitiated))

    } catch {
      reject("START_ERROR", "Failed to create listener: \(error)", error)
    }
  }

  @objc(stop:rejecter:)
  func stop(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    listener?.cancel()
    connections.forEach { $0.cancel() }
    connections.removeAll()
    isRunning = false
    resolve(nil)
  }

  @objc(sendResponse:body:headers:resolver:rejecter:)
  func sendResponse(_ connectionId: String, body: String, headers: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {

    guard let index = Int(connectionId), index < connections.count else {
      reject("INVALID_CONNECTION", "Connection not found", nil)
      return
    }

    let connection = connections[index]

    var headerString = "HTTP/1.1 200 OK\r\n"
    headerString += "Content-Type: application/json\r\n"
    headerString += "Access-Control-Allow-Origin: *\r\n"
    headerString += "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
    headerString += "Access-Control-Allow-Headers: Content-Type\r\n"

    for (key, value) in headers {
      headerString += "\(key): \(value)\r\n"
    }

    headerString += "Content-Length: \(body.utf8.count)\r\n"
    headerString += "\r\n"

    let response = headerString + body

    if let data = response.data(using: .utf8) {
      connection.send(content: data, completion: .contentProcessed { error in
        if let error = error {
          reject("SEND_ERROR", "Failed to send response: \(error)", error)
        } else {
          resolve(nil)
        }
      })
    }
  }

  private func handleConnection(_ connection: NWConnection) {
    let connectionId = connections.count
    connections.append(connection)

    connection.stateUpdateHandler = { [weak self] state in
      switch state {
      case .ready:
        self?.receiveData(connection: connection, connectionId: connectionId)
      case .failed(let error):
        self?.sendEvent(withName: "onError", body: ["error": error.localizedDescription])
      default:
        break
      }
    }

    connection.start(queue: .global(qos: .userInitiated))
  }

  private func receiveData(connection: NWConnection, connectionId: Int) {
    connection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { [weak self] data, _, isComplete, error in

      if let error = error {
        self?.sendEvent(withName: "onError", body: ["error": error.localizedDescription])
        return
      }

      if let data = data, !data.isEmpty {
        if let request = String(data: data, encoding: .utf8) {
          self?.parseAndEmitRequest(request, connectionId: connectionId)
        }
      }

      if !isComplete {
        self?.receiveData(connection: connection, connectionId: connectionId)
      }
    }
  }

  private func parseAndEmitRequest(_ raw: String, connectionId: Int) {
    let lines = raw.components(separatedBy: "\r\n")
    guard let firstLine = lines.first else { return }

    let parts = firstLine.components(separatedBy: " ")
    guard parts.count >= 2 else { return }

    let method = parts[0]
    let path = parts[1]

    // Find body (after empty line)
    var body = ""
    if let emptyLineIndex = lines.firstIndex(of: "") {
      let bodyLines = lines.dropFirst(emptyLineIndex + 1)
      body = bodyLines.joined(separator: "\r\n")
    }

    // Parse headers
    var headers: [String: String] = [:]
    for line in lines.dropFirst() {
      if line.isEmpty { break }
      let headerParts = line.components(separatedBy: ": ")
      if headerParts.count >= 2 {
        headers[headerParts[0]] = headerParts.dropFirst().joined(separator: ": ")
      }
    }

    sendEvent(withName: "onRequest", body: [
      "connectionId": String(connectionId),
      "method": method,
      "path": path,
      "headers": headers,
      "body": body
    ])
  }
}
