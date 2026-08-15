# funnel.json

The structured handoff at the run directory root. One object. No extra top-level keys.

## Required keys

| Key | Type | Meaning |
| --- | --- | --- |
| `funnel` | object | The landing page or offer the ads point at. |
| `funnel.url` | string | Absolute HTTP(S) URL. |
| `source` | object | Where the ads were collected from. |
| `source.ads_deeplink` | string | The operator's Meta/Facebook ads deeplink, stored as given. |
| `ads` | array | Ad objects. Empty if nothing could be extracted. |

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
| `path` | string | Path relative to the run directory. Present only when that file exists on disk. |

A media object with no file on disk has `kind` and `source_url` and no `path`.

## Paths

- `path` values are relative to the run directory (example: `media/123-0.jpg`).
- `path` is omitted when the file is missing, the download failed, or no creative URL was found.
- `path` is never an invented, planned, or "would have been" location.

## Example

```json
{
  "funnel": {
    "url": "https://example.com/offer"
  },
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
