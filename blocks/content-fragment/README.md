# Content Fragment block — Covista

Renders an AEM **Content Fragment** as a banner (image + title + subtitle +
description + CTA). Author picks the fragment in the Universal Editor dialog and
chooses a **Style** and **Alignment**. The **same fragment can be placed on any
number of pages** — edit it once, every placement updates.

## 1. Content Fragment Model (AEM author)

This block is wired to the **CTA** content-fragment model, whose fields are:

| Field label | Property name | Type |
|-------------|---------------|------|
| Title | `title` | Single line text |
| Subtitle | `subtitle` | Single line text |
| Description | `description` | Multi line text (rich text) |
| Banner Image | `bannerimage` | Content Reference (image) |
| CTA Label | `ctalabel` | Single line text |
| CTA URL | `ctaurl` | Content Reference (page) |

## 2. Create the GraphQL persisted query (AEM author, one-time)

The block fetches via `/graphql/execute.json/ref-demo-eds/CTAByPath`.
Create it with AEM's GraphQL Query editor (or the persisted-query API), name
**`CTAByPath`**, with this query, then **Publish** it:

```graphql
query CTAByPath($path: String!, $variation: String! = "master") {
  ctaByPath(_path: $path, variation: $variation) {
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

> The `ref-demo-eds` segment is the GraphQL **endpoint** name (the CTA model +
> CTAByPath query live there). If your endpoint is named differently, update
> `CONFIG.GRAPHQL_QUERY` at the top of `content-fragment.js`. If the
> model/query/field names differ, update `CONFIG` + the `item.*` reads to match.

## 3. Author a fragment

AEM → **Content Fragments** → Create → model **CTA** → e.g.
`/content/dam/covistademo1/en/fragments/promotions/covistapromotion`. Fill in
title/subtitle/description,
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
