# ads.json

The structured handoff this skill writes at `<workdir>/ads.json`. One object. No extra top-level keys.

## Required keys

| Key | Type | Meaning |
| --- | --- | --- |
| `source` | object | Where the ads were collected from. |
| `source.ads_deeplink` | string | The operator's Meta/Facebook ads deeplink, stored as given. |
| `ads` | array | Ad objects. Empty if nothing could be extracted. At most one object when `source.ads_deeplink` has a non-empty `id` query parameter. |

## Ad object

Each element of `ads` is an object. Include a field only when a value was found.

| Key | Type | Meaning |
| --- | --- | --- |
| `id` | string | Platform ad id when visible. |
| `permalink` | string | Absolute URL of the ad when visible. |
| `advertiser` | string | Advertiser or Page name when visible. |
| `body` | string | Primary text. |
| `headline` | string | Headline. |
| `description` | string | Link or extra description. |
| `cta` | string | Call-to-action label. |
| `media` | array | Creative files. Omit the key when there are no media entries. |

## Media object

Each element of `media` is an object.

| Key | Type | Meaning |
| --- | --- | --- |
| `kind` | string | `image`, `video`, or `unknown`. |
| `source_url` | string | Absolute URL the file was fetched from, when known. |
| `path` | string | Path relative to the workdir. Present only when that file exists on disk. |

A media object with no file on disk has `kind` and `source_url` and no `path`.

## Paths

- `path` values are relative to the workdir (example: `media/123-0.jpg`).
- `path` is omitted when the file is missing, the download failed, or no creative URL was found.
- `path` is never an invented, planned, or "would have been" location.

## Example

```json
{
  "source": {
    "ads_deeplink": "https://www.facebook.com/ads/library/?id=123"
  },
  "ads": [
    {
      "id": "123",
      "permalink": "https://www.facebook.com/ads/library/?id=123",
      "advertiser": "Example",
      "body": "Primary text",
      "headline": "Headline",
      "cta": "Shop Now",
      "media": [
        {
          "kind": "image",
          "source_url": "https://cdn.example/creative.jpg",
          "path": "media/123-0.jpg"
        }
      ]
    }
  ]
}
```
