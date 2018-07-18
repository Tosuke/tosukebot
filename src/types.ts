export interface Channel {
  id: string
  name: string
  is_channel: boolean
  created: number
  creator: string
  is_archived: boolean
  is_general: boolean
  name_normalized: string
  is_shared: boolean
  is_org_shared: boolean
  is_member: boolean
  is_private: boolean
  is_mpim: boolean
  last_read: string
  latest: {
    text: string
    username: string
    bot_id: string
    attachments: {
      text: string
      id: number
      fallback: string
    }[]
    type: string
    subtype: string
    ts: string
  }
  unread_count: number
  unread_count_display: number
  members: string[]
  topic: {
    value: string
    creator: string
    last_set: number
  }
  purpose: {
    value: string
    creator: string
    last_set: number
  }
  previous_names: string[]
}

export interface User {
  id: string
  team_id: string
  name: string
  deleted: boolean
  color: string
  real_name: string
  tz: string
  tz_label: string
  tz_offset: number
  profile: {
    avatar_hash: string
    status_text: string
    status_emoji: string
    real_name: string
    display_name: string
    real_name_normalized: string
    display_name_normalized: string
    email: string
    image_24: string
    image_32: string
    image_48: string
    image_72: string
    image_192: string
    image_512: string
    team: string
  }

  is_admin: boolean
  is_owner: boolean
  is_primary_owner: boolean
  is_restricted: boolean
  is_ultra_restricted: boolean
  is_bot: boolean
  is_stranger: boolean
  updated: number
  is_app_user: boolean
  has_2fa: boolean
  locale: string
}

export interface File {
  id: string
  created: number
  timestamp: number
  name: string
  title: string
  mimetype: string
  filetype: string
  pretty_type: string
  user: string
  mode: string
  editable: boolean
  is_external: boolean
  external_type: string
  username: string
  size: number
  url_private: string
  url_private_download: string
  thumb_64: string
  thumb_80: string
  thumb_360: string
  thumb_360_gif: string
  thumb_360_w: number
  thumb_360_h: number
  thumb_480: string
  thumb_480_w: number
  thumb_480_h: number
  thumb_160: string
  permalink: string
  permalink_public: string
  edit_link: string
  preview: string
  preview_highlight: string
  lines: number
  lines_more: number
  is_public: boolean
  public_url_shared: boolean
  display_as_bot: boolean
  channels: string[]
  groups: string[]
  ims: string[]
  initial_comment: object
  num_stars: number
  is_starred: boolean
  pinned_to: string[]
  reactions: {
    name: string
    count: number
    users: string[]
  }[]
  comments_count: number
}
