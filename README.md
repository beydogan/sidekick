# Sidekick

A macOS companion for App Store Connect. Open-source, runs locally, your credentials never leave your machine.

Coming to the App Store soon. Until then, clone and run it yourself.

Built with [react-native-macos](https://github.com/microsoft/react-native-macos).

## Getting Started

### Prerequisites

- Node.js >= 18
- Yarn
- Xcode with macOS development tools
- CocoaPods

### Install Dependencies

```sh
yarn install
```

Install CocoaPods dependencies:

```sh
bundle install
bundle exec pod install --project-directory=macos
```

### Run the App

Start Metro bundler:

```sh
yarn start
```

In a new terminal, build and run the macOS app:

```sh
yarn macos
```

You can also open `macos/sidekick.xcworkspace` in Xcode and build from there.

## Development

- **Lint**: `yarn lint`
- **Test**: `yarn test`
- **Type check**: `npx tsc --noEmit`

## Learn More

- [React Native macOS](https://microsoft.github.io/react-native-windows/docs/rnm-getting-started)
- [React Native](https://reactnative.dev)
