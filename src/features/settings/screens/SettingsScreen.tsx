import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Switch,
  ScrollView,
} from 'react-native';
import {observer} from '@legendapp/state/react';
import {Screen, NavigationHeader, Pressable, TextInput as StyledTextInput, Dropdown} from '@ui';
import {colors, spacing, typography, radii} from '@theme';
import {
  savePrivateKey,
  saveCredentialsConfig,
  loadCredentialsConfig,
  testConnection,
  clearCredentials,
} from '@libs/appStoreConnect';
import type {CredentialsConfig} from '@libs/appStoreConnect';
import {ui$, AI_PROVIDERS, type AIProvider} from '@stores/ui';
import {useMCPServer} from '@libs/mcp/useMCPServer';
import {saveAICredentials, loadAICredentials, clearAICredentials} from '@libs/ai';

interface Props {
  onConnectionSuccess?: () => void;
}

export const SettingsScreen = observer(function SettingsScreen({
  onConnectionSuccess,
}: Props) {
  const [apiKeyId, setApiKeyId] = useState('');
  const [issuerId, setIssuerId] = useState('');
  const [privateKeyContent, setPrivateKeyContent] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const mcpEnabled = ui$.mcpServer.enabled.get();
  const mcpPort = ui$.mcpServer.port.get();
  const mcp = useMCPServer({port: mcpPort});

  // AI Assistant state
  const [aiProvider, setAiProvider] = useState<AIProvider>('openai');
  const [aiApiKey, setAiApiKey] = useState('');
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [aiConfigured, setAiConfigured] = useState(false);

  // Clear error when user types
  const handleApiKeyChange = (text: string) => {
    setApiKeyId(text);
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };
  const handleIssuerChange = (text: string) => {
    setIssuerId(text);
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };
  const handleKeyChange = (text: string) => {
    setPrivateKeyContent(text);
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    loadExistingConfig();
    loadExistingAIConfig();
  }, []);

  async function loadExistingConfig() {
    const config = await loadCredentialsConfig();
    if (config) {
      setApiKeyId(config.apiKeyId);
      setIssuerId(config.issuerId);
      setIsConfigured(true);
    }
  }

  async function handleSave() {
    if (!apiKeyId || !issuerId || !privateKeyContent) {
      setErrorMessage('All fields are required');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      console.log('[Settings] Saving credentials...');
      const keyPath = await savePrivateKey(privateKeyContent, apiKeyId);
      const config: CredentialsConfig = {
        apiKeyId,
        issuerId,
        privateKeyPath: keyPath,
      };
      await saveCredentialsConfig(config);
      console.log('[Settings] Credentials saved, testing connection...');

      const connected = await testConnection();
      console.log('[Settings] Connection result:', connected);
      if (connected) {
        setStatus('success');
        setIsConfigured(true);
        onConnectionSuccess?.();
      } else {
        setStatus('error');
        setErrorMessage('Connection failed. Check your credentials.');
      }
    } catch (err) {
      console.error('[Settings] Error:', err);
      setStatus('error');
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
    }
  }

  async function handleClear() {
    await clearCredentials();
    setApiKeyId('');
    setIssuerId('');
    setPrivateKeyContent('');
    setIsConfigured(false);
    setStatus('idle');
  }

  async function handleTestConnection() {
    setStatus('loading');
    setErrorMessage('');

    try {
      const connected = await testConnection();
      if (connected) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('Connection failed');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Connection failed',
      );
    }
  }

  const handleMCPToggle = async (value: boolean) => {
    ui$.mcpServer.enabled.set(value);
    if (value) {
      await mcp.start();
    } else {
      await mcp.stop();
    }
  };

  const handleMCPPortChange = (text: string) => {
    const port = parseInt(text, 10);
    if (!isNaN(port) && port > 0 && port <= 65535) {
      ui$.mcpServer.port.set(port);
    }
  };

  async function loadExistingAIConfig() {
    const credentials = await loadAICredentials();
    if (credentials) {
      setAiProvider(credentials.provider);
      setAiConfigured(true);
      ui$.aiAssistant.provider.set(credentials.provider);
    }
  }

  async function handleSaveAI() {
    if (!aiApiKey) {
      return;
    }
    setAiStatus('loading');
    try {
      await saveAICredentials({provider: aiProvider, apiKey: aiApiKey});
      ui$.aiAssistant.provider.set(aiProvider);
      setAiConfigured(true);
      setAiStatus('success');
      setAiApiKey('');
    } catch {
      setAiStatus('idle');
    }
  }

  async function handleClearAI() {
    await clearAICredentials();
    ui$.aiAssistant.provider.set(null);
    setAiConfigured(false);
    setAiApiKey('');
    setAiStatus('idle');
  }

  return (
    <Screen padded={false}>
      <NavigationHeader title="Settings" showBack={false} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* MCP Server Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>MCP SERVER</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardRowContent}>
              <Text style={styles.cardLabel}>Enable Server</Text>
              <Text style={styles.cardHint}>
                Start the MCP server for external integrations
              </Text>
            </View>
            <Switch
              value={mcpEnabled}
              onValueChange={handleMCPToggle}
              trackColor={{false: colors.border, true: colors.primary}}
            />
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardRow}>
            <View style={styles.cardRowContent}>
              <Text style={styles.cardLabel}>Port</Text>
            </View>
            <StyledTextInput
              style={styles.portInput}
              value={String(mcpPort)}
              onChangeText={handleMCPPortChange}
              keyboardType="numeric"
              editable={!mcpEnabled}
              mono
            />
          </View>
        </View>
        {mcp.isRunning && (
          <Text style={styles.sectionFooter}>
            Server running on port {mcpPort}
          </Text>
        )}
        {mcp.error && (
          <Text style={[styles.sectionFooter, styles.errorFooter]}>
            {mcp.error}
          </Text>
        )}
      </View>

        {/* AI Assistant Section */}
        <View style={[styles.section, {zIndex: 100}]}>
          <Text style={styles.sectionHeader}>AI ASSISTANT</Text>
          <View style={[styles.card, {zIndex: 100}]}>
            <View style={[styles.cardRow, {zIndex: 10}]}>
              <View style={styles.cardRowContent}>
                <Text style={styles.cardLabel}>Provider</Text>
              </View>
              <Dropdown
                options={AI_PROVIDERS.map(p => ({value: p.id, label: p.label}))}
                value={aiProvider}
                onChange={setAiProvider}
                disabled={aiConfigured}
              />
            </View>
            <View style={[styles.cardDivider, {zIndex: 1}]} />
            <View style={[styles.cardRow, {zIndex: 1}]}>
              <View style={styles.cardRowContent}>
                <Text style={styles.cardLabel}>API Key</Text>
                {aiConfigured && (
                  <Text style={styles.cardHint}>Key saved securely</Text>
                )}
              </View>
              {!aiConfigured && (
                <StyledTextInput
                  style={styles.apiKeyInput}
                  value={aiApiKey}
                  onChangeText={setAiApiKey}
                  placeholder="sk-..."
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry
                  mono
                />
              )}
            </View>
          </View>
          <View style={styles.aiActions}>
            {!aiConfigured ? (
              <Pressable
                style={[styles.button, styles.primaryButton]}
                onPress={handleSaveAI}
                disabled={!aiApiKey || aiStatus === 'loading'}>
                {aiStatus === 'loading' ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.primaryButtonText}>Save</Text>
                )}
              </Pressable>
            ) : (
              <Pressable
                style={[styles.button, styles.dangerButton]}
                onPress={handleClearAI}>
                <Text style={styles.dangerButtonText}>Clear Credentials</Text>
              </Pressable>
            )}
          </View>
          {aiStatus === 'success' && (
            <Text style={styles.sectionFooter}>
              API key saved for {AI_PROVIDERS.find(p => p.id === aiProvider)?.label}
            </Text>
          )}
        </View>

        {/* App Store Connect Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>APP STORE CONNECT</Text>
          <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>API Key ID</Text>
          <TextInput
            style={styles.input}
            value={apiKeyId}
            onChangeText={handleApiKeyChange}
            placeholder="e.g., ABC123DEFG"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Issuer ID</Text>
          <TextInput
            style={styles.input}
            value={issuerId}
            onChangeText={handleIssuerChange}
            placeholder="e.g., 12345678-1234-1234-1234-123456789012"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Private Key (.p8 content)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={privateKeyContent}
            onChangeText={handleKeyChange}
            placeholder="Paste your .p8 key content here..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={6}
          />
          <Text style={styles.hint}>
            Paste the full content of your AuthKey_XXXXXX.p8 file
          </Text>
        </View>

        {status === 'error' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {status === 'success' && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>Connected successfully</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={handleSave}
            disabled={status === 'loading'}>
            {status === 'loading' ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isConfigured ? 'Update' : 'Save'} & Connect
              </Text>
            )}
          </Pressable>

          {isConfigured && (
            <>
              <Pressable
                style={[styles.button, styles.secondaryButton]}
                onPress={handleTestConnection}
                disabled={status === 'loading'}>
                <Text style={styles.secondaryButtonText}>Test Connection</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.dangerButton]}
                onPress={handleClear}
                disabled={status === 'loading'}>
                <Text style={styles.dangerButtonText}>Clear Credentials</Text>
              </Pressable>
            </>
          )}
          </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  section: {
    marginBottom: spacing.xxl,
    maxWidth: 480,
  },
  sectionHeader: {
    ...typography.caption,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  sectionFooter: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  errorFooter: {
    color: colors.error,
  },
  card: {
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.xl,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  cardRowContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  cardLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  cardHint: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.lg,
  },
  portInput: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'right',
    width: 80,
  },
  apiKeyInput: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  aiActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  form: {
    maxWidth: 480,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  hint: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
  },
  successBox: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  successText: {
    ...typography.body,
    color: colors.success,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  dangerButton: {
    backgroundColor: 'transparent',
  },
  dangerButtonText: {
    ...typography.body,
    color: colors.error,
  },
});
