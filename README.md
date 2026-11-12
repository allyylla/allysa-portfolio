# Allysa M. Pinca — Personal Portfolio

A single-page portfolio built with plain HTML, CSS, and JavaScript. No build step and no dependencies.

## Files
```
index.html    page content (all sections)
styles.css    palette, layout, animations, responsive rules
script.js     scroll reveal, nav, project toggles, contact form
assets/       put profile.jpg here
```

## Customize
- **Profile photo:** save your photo as `assets/profile.jpg`. A portrait (4:5) crop looks best. The "AP" initials show until the file exists.
- **Colors:** edit the variables at the top of `styles.css` (`--petal`, `--rose`, `--straw`, `--berry`, `--grape`).
- **Contact form:** by default it checks the fields, then opens the visitor's email app with the message already filled in. If you want messages delivered straight to your inbox, make a free form at https://formspree.io and paste its URL into `FORM_ENDPOINT` in `script.js`.

## Preview locally
Open `index.html` in a browser, or run a small local server:
```bash
npx serve .
```

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. At https://vercel.com/new, import the repo. Set Framework Preset to **Other** and leave the build command empty.
3. Click **Deploy**.

You can also deploy from the terminal with `npx vercel` from inside this folder.
