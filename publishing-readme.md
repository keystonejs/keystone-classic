# Publishing Workflow Features
These changes include modules added that enable:

- Publishing Workflow
- Revisions & rollback
- Preview of draft content
- Sitemap


## Publishing Workflow
To enable you need to:

- enable publishing options in the model
- enable user permisions

### Enable Model Options
Options & enabling can be set for each model via it's options. To enable and use the defaults just set:
` publishing: { enabled: true } `
Or for more control you can use:
``` 
publishing: {  
enabled: false // can be disabled  
stateField: 'publishing.state', // field to publishing content state
selfApproval: true, // Allows users to self approval to change state
approvalStates: ['draft', 'published', 'archived', 'deleted'],
previewStates: ['draft', 'published', 'archived', 'deleted'], // States that can be viewed in preview mode
unpublishStates: ['archived','draft'] // default state for unpublished content
publishStates: ['published'],
previewPath: '/', // Root url for previewing this list type. e.g '/blog/posts/
itemPathField: 'slug', used for previews and links
previewParam: preview //URL param to enable preview mode. It's an option in case there is a naming conflict
} 
```

### Enable User Permissions
User.permissins: (Using WP Roles as our reference https://codex.wordpress.org/Roles_and_Capabilities)
With publishing enabled these User.permissions fields need to be added to enable publishing roles:
 
 - isContributor - Can create & edit own content
 - isAuthor - Can create, edit & publish own content
 - isEditor - Can crete, edit & publish any content

## Revisions & Rollback
To enable set in your model options:
`   history: true,
    revisions: {
        enabled: true,
        excludeFields: ['publishing', 'publishDate', 'updatedBy', 'updatedAt']
     }
  `
You can exlcude fields for revision compare if needed.

## Preview Draft content
Make sure previewPath settings are correct in the publishing options. Specifically 

- previewPath: '/' - Root url for previewing this list type. e.g '/blog/posts/
- itemPathField: 'slug' - used for previews and links
- previewParam: preview - URL param to enable preview mode. It's an option in case there is a naming conflict
Content in draft mode can be previewed by appending ?preview=true to it's URL

## Sitemap
This will server a /sitemap.xml that is called by Search Engines. To enable it:
- open /server/routes/index.js and add:
`app.get('/sitemap.xml', (req, res) => { keystone.Sitemap.create(keystone, req, res); });`

## Known issues

