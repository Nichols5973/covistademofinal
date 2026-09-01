# Content Fragment block — Covista

Renders an AEM **Content Fragment** as a banner (image + title + subtitle +
description + CTA). Author picks the fragment in the Universal Editor dialog and
chooses a **Style** and **Alignment**. The **same fragment can be placed on any
number of pages** — edit it once, every placement updates.

## 1. Create the Content Fragment Model (AEM author, one-time)

AEM → **Tools → General → Content Fragment Models** → your `covistademo1`
configuration → **Create**. Name it **`Covista Banner`** (id `covista-banner`).
Add these fields (names must match exactly — the block + GraphQL query rely on them):

| Field label | Property name | Type |
|-------------|---------------|------|
| Title | `title` | Single line text |
| Subtitle | `subtitle` | Single line text |
| Description | `description` | Multi line text (rich text) |
| Banner Image | `bannerimage` | Content Reference (image) |
| CTA Label | `ctalabel` | Single line text |
| CTA URL | `ctaurl` | Content Reference (page) |

Enable it, then **Publish** the model.

## 2. Create the GraphQL persisted query (AEM author, one-time)

The block fetches via `/graphql/execute.json/covistademo1/BannerByPath`.
Create it with AEM's GraphQL Query editor (or the persisted-query API) against
the `covistademo1` endpoint, name **`BannerByPath`**, with this query:

```graphql
query BannerByPath($path: String!, $variation: String! = "master") {
  bannerByPath(_path: $path, variation: $variation) {
    item {
      title
      subtitle
      description { plaintext html }
      bannerimage { _authorUrl _publishUrl }
      ctalabel
      ctaurl { _path _authorUrl _publishUrl }
    }
  }
}
```

**Publish** the persisted query.

> If you name the model/query/fields differently, update `CONFIG` and the
> `item.*` reads at the top of `content-fragment.js` to match.

## 3. Author a fragment

AEM → **Content Fragments** → Create → model **Covista Banner** → e.g.
`/content/dam/covistademo1/banners/join-us`. Fill in title/subtitle/description,
pick a banner image, set CTA label + URL. Add **Variations** if you want
alternates (the dialog can select a variation per placement). **Publish** it.

## 4. Place it on a page — then reuse on another (the demo)

On **any** page in the Universal Editor:
1. Add the **Content Fragment** block.
2. In the dialog: **Content Fragment Picker** → select the fragment above;
   choose a **Style** (Image Left/Right/Top/Bottom or Default overlay) and
   **Alignment**.
3. Publish the page.

Repeat step 4 on a **second** page, picking the **same** fragment. Both pages
render identical content from the one source. Edit the fragment (step 3) and
republish it — both pages update, proving single-source reuse.

## Files
- `_content-fragment.json` — UE dialog model (CF picker, variation, style, alignment)
- `content-fragment.js` — fetch + render (author/publish aware)
- `content-fragment.css` — banner styling + the 4 image-layout variations
