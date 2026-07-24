/** Count song + set items waiting in the local sync queue. */
export async function getPendingQueueCount(deps: {
  getPending: () => Promise<unknown[]>
  getPendingRepertoires: () => Promise<unknown[]>
}): Promise<number> {
  const [songs, reps] = await Promise.all([
    deps.getPending(),
    deps.getPendingRepertoires(),
  ])
  return songs.length + reps.length
}

export type SyncStatusKind =
  | "offline"
  | "syncing"
  | "pending"
  | "synced"
  | "local"

export type SyncStatusView = {
  kind: SyncStatusKind
  /** Short chip label */
  label: string
  /** Longer hint for Settings / title */
  detail: string
}

export function describeSyncStatus(input: {
  online: boolean
  syncing: boolean
  pendingCount: number
  signedIn: boolean
}): SyncStatusView {
  const { online, syncing, pendingCount, signedIn } = input

  if (!online) {
    return {
      kind: "offline",
      label: "Offline",
      detail:
        pendingCount > 0
          ? `${pendingCount} change(s) waiting — will sync when you are back online.`
          : "You are offline. Charts stay on this device.",
    }
  }

  if (syncing) {
    return {
      kind: "syncing",
      label: "Syncing…",
      detail: "Uploading and merging with the cloud.",
    }
  }

  if (pendingCount > 0) {
    return {
      kind: "pending",
      label: `${pendingCount} pending`,
      detail: signedIn
        ? `${pendingCount} change(s) waiting to sync with the cloud.`
        : `${pendingCount} change(s) on this device. Sign in to sync across devices.`,
    }
  }

  if (signedIn) {
    return {
      kind: "synced",
      label: "Synced",
      detail: "No pending changes. Library matches the cloud queue.",
    }
  }

  return {
    kind: "local",
    label: "Local only",
    detail: "Not signed in. Charts stay on this device until you sign in.",
  }
}
