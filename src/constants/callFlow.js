export const CHECKLIST_ITEMS = [
  'IVR Spiel',
  'SSO',
  'NBA',
  'Triggers',
  'Closing Probe',
  'Repeat Caller Spiel',
  'Grand Stand Closing',
  'Release',
]

// Items that use a single Yes/No checkbox instead of Done/NA/Others
export const YES_NO_ITEMS = ['IVR Spiel', 'SSO', 'Closing Probe', 'Repeat Caller Spiel', 'Grand Stand Closing']

// Items that use the three-status Done/NA/Others controls
export const STATUS_ITEMS = ['NBA', 'Triggers']

// Items that use a dropdown select instead of Done/NA/Others
export const DROPDOWN_ITEMS = ['Release']

// Release dropdown labels map to the old status function:
// Released = Done, Member Released = Not Available, Transfer = Others
export const RELEASE_OPTIONS = ['Released', 'Member Released', 'Transfer']
export const RELEASE_DONE = 'Released'
export const RELEASE_TRANSFER = 'Transfer'

export const CLASSIFICATIONS = ['Undefined', 'Promoter', 'Passive', 'Detractor']

export const CALL_TYPES = [
  'Authorizations',
  'Enrollment',
  'Benefits',
  'Providers',
  'Claims',
  'Pharmacy',
  'Demographics',
  'Web Portal / App',
  'Rewards',
  'Appeals',
]

export const STATUS_DONE = 'Done'
export const STATUS_NOT_AVAILABLE = 'Not Available'
export const STATUS_OTHERS = 'Others'