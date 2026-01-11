/**
 * AIAssistantSidebar - App-wide AI assistant panel
 */

import React, {useState, useRef, useCallback, useEffect} from 'react';
import {View, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {Sparkles, Send, AlertCircle} from 'lucide-react-native';
import {colors, layout, spacing, typography, radii} from '@theme';
import {Text, Pressable, TextInput} from '@ui/primitives';
import {useAIChat} from '../hooks/useAIChat';

export const AIAssistantSidebar: React.FC = () => {
  const {messages, isLoading, isConfigured, error, sendMessage, clearMessages} =
    useAIChat();
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 50);
  }, [messages]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput('');
    await sendMessage(trimmed);
  }, [input, isLoading, sendMessage]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Sparkles size={14} color={colors.activeAccent} strokeWidth={2} />
        <Text style={styles.headerTitle}>AI Assistant</Text>
        {messages.length > 0 && (
          <Pressable style={styles.clearButton} onPress={clearMessages}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        showsVerticalScrollIndicator={false}>
        {!isConfigured ? (
          <View style={styles.emptyState}>
            <AlertCircle size={20} color={colors.textTertiary} strokeWidth={1.5} />
            <Text style={styles.emptyText}>
              Configure AI in Settings to get started
            </Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Ask me anything about your app</Text>
          </View>
        ) : (
          messages.map(message => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.role === 'user'
                  ? styles.userBubble
                  : styles.assistantBubble,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  message.role === 'user' && styles.userText,
                ]}
                selectable>
                {message.content}
              </Text>
            </View>
          ))
        )}
        {isLoading && (
          <View style={[styles.messageBubble, styles.assistantBubble]}>
            <ActivityIndicator size="small" color={colors.textSecondary} />
          </View>
        )}
        {error && (
          <View style={styles.errorBubble}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
          placeholder={isConfigured ? 'Ask a question...' : 'Configure AI in Settings'}
          placeholderTextColor={colors.textTertiary}
          editable={isConfigured}
        />
        <Pressable
          style={[
            styles.sendButton,
            (!input.trim() || isLoading || !isConfigured) &&
              styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!input.trim() || isLoading || !isConfigured}>
          <Send
            size={14}
            color={
              input.trim() && !isLoading && isConfigured
                ? colors.activeAccent
                : colors.textTertiary
            }
            strokeWidth={2}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: layout.aiSidebarWidth,
    backgroundColor: colors.sidebar,
    borderLeftWidth: 1,
    borderLeftColor: colors.sidebarBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.sidebarBorder,
  },
  headerTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
  },
  clearButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  clearButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  emptyState: {
    flex: 1,
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.content,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  messageText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  userText: {
    color: colors.activeAccent,
  },
  errorBubble: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.sidebarBorder,
    backgroundColor: colors.content,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.sidebar,
    borderRadius: radii.lg,
    ...typography.body,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
