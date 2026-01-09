import type {AppVersionState, Platform} from '@libs/appStoreConnect';

export type VersionStateCategory = 'editable' | 'inProgress' | 'live' | 'removed';

const EDITABLE_STATES: AppVersionState[] = [
  'PREPARE_FOR_SUBMISSION',
  'DEVELOPER_REJECTED',
  'REJECTED',
  'METADATA_REJECTED',
  'INVALID_BINARY',
];

const IN_PROGRESS_STATES: AppVersionState[] = [
  'WAITING_FOR_REVIEW',
  'IN_REVIEW',
  'READY_FOR_REVIEW',
  'PROCESSING_FOR_DISTRIBUTION',
  'PENDING_APPLE_RELEASE',
  'PENDING_DEVELOPER_RELEASE',
  'WAITING_FOR_EXPORT_COMPLIANCE',
];

const LIVE_STATES: AppVersionState[] = ['READY_FOR_DISTRIBUTION', 'ACCEPTED'];

export function getVersionStateCategory(
  state: AppVersionState,
): VersionStateCategory {
  if (EDITABLE_STATES.includes(state)) return 'editable';
  if (IN_PROGRESS_STATES.includes(state)) return 'inProgress';
  if (LIVE_STATES.includes(state)) return 'live';
  return 'removed';
}

export function isVersionEditable(state: AppVersionState): boolean {
  return EDITABLE_STATES.includes(state);
}

export function formatPlatformName(platform: Platform): string {
  const platformNames: Record<Platform, string> = {
    IOS: 'iOS App',
    MAC_OS: 'macOS App',
    TV_OS: 'tvOS App',
    VISION_OS: 'visionOS App',
  };
  return platformNames[platform] || platform;
}

export function formatVersionState(state: AppVersionState): string {
  const stateLabels: Record<AppVersionState, string> = {
    ACCEPTED: 'Accepted',
    DEVELOPER_REJECTED: 'Developer Rejected',
    IN_REVIEW: 'In Review',
    INVALID_BINARY: 'Invalid Binary',
    METADATA_REJECTED: 'Metadata Rejected',
    PENDING_APPLE_RELEASE: 'Pending Apple Release',
    PENDING_DEVELOPER_RELEASE: 'Pending Release',
    PREPARE_FOR_SUBMISSION: 'Prepare for Submission',
    PROCESSING_FOR_DISTRIBUTION: 'Processing',
    READY_FOR_DISTRIBUTION: 'Ready for Distribution',
    READY_FOR_REVIEW: 'Ready for Review',
    REJECTED: 'Rejected',
    REPLACED_WITH_NEW_VERSION: 'Replaced',
    WAITING_FOR_EXPORT_COMPLIANCE: 'Waiting for Compliance',
    WAITING_FOR_REVIEW: 'Waiting for Review',
  };
  return stateLabels[state] || state;
}
