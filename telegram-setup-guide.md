# Telegram Mini App Setup Guide

This guide walks you through setting up TapSync as a Telegram Mini App.

## Prerequisites

- Telegram account
- Deployed frontend (GitHub Pages, Netlify, Vercel, etc.)
- (Optional) Deployed backend API

## Step-by-Step Setup

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Start a chat and send `/newbot`
3. Follow the prompts:
   - **Bot name**: TapSync (or your preferred name)
   - **Bot username**: Must end in 'bot' (e.g., `tapsync_game_bot`)
4. Save the API token provided (you won't need it for a simple Mini App)

### 2. Create a Mini App

1. In the same chat with @BotFather, send `/newapp`
2. Select your bot from the list
3. Provide the following information:

#### App Title
```
TapSync
```

#### App Description
```
A rhythm game with dynamic beatmap generation. Upload your favorite music and play!
```

#### App Photo
Upload a 640x360 PNG image (create one or use a screenshot of the game)

Example specifications:
- Size: 640x360 pixels
- Format: PNG
- Content: Game logo or screenshot

#### App Demo GIF (Optional)
Upload a demo GIF showing gameplay
- Size: Up to 640x360 pixels
- Format: GIF
- Duration: 3-10 seconds

#### Web App URL
Your deployed frontend URL, for example:
```
https://yourusername.github.io/tap-sync/
```

or
```
https://tapsync.netlify.app
```

### 3. Configure Bot Commands

1. Send `/setcommands` to @BotFather
2. Select your bot
3. Send the following commands:

```
start - Start TapSync game
help - Show game instructions
about - About TapSync
```

### 4. Set Menu Button

1. Send `/setmenubutton` to @BotFather
2. Select your bot
3. Choose "Edit menu button URL"
4. Enter your Mini App URL (same as Web App URL)
5. Enter button text: `Play TapSync`

### 5. Set Bot Description (Optional)

1. Send `/setdescription` to @BotFather
2. Select your bot
3. Enter description:

```
🎮 TapSync - Rhythm Game

Upload any audio file and play a rhythm game with auto-generated beatmap!

Features:
🎵 Dynamic beatmap generation
🎮 4-lane rhythm gameplay
🎯 Perfect/Good/Miss timing system
📊 Score tracking and combos
📱 Optimized for mobile

Tap to start playing!
```

### 6. Set About Text

1. Send `/setabouttext` to @BotFather
2. Select your bot
3. Enter about text:

```
TapSync is a Telegram Mini App rhythm game with dynamic beatmap generation from user-uploaded audio files.
```

### 7. Test Your Mini App

1. Open your bot in Telegram
2. Click the menu button or send `/start`
3. The Mini App should open in Telegram's WebView
4. Test all functionality:
   - Upload audio
   - Play game
   - Check scoring
   - Test controls

## Deployment Checklist

- [ ] Frontend deployed to hosting service
- [ ] HTTPS enabled (required for Telegram Mini Apps)
- [ ] Bot created with @BotFather
- [ ] Mini App configured with Web App URL
- [ ] Commands set up
- [ ] Menu button configured
- [ ] Description and about text set
- [ ] App photo uploaded
- [ ] Tested in Telegram

## Updating Your Mini App

### Update Web App URL

If you move to a different hosting provider:

1. Send `/editapp` to @BotFather
2. Select your bot
3. Choose your app
4. Select "Edit URL"
5. Enter new URL

### Update App Information

To update description, photo, or other details:

1. Send `/editapp` to @BotFather
2. Select your bot
3. Choose your app
4. Select what you want to edit

## Troubleshooting

### Mini App Not Opening

**Problem**: Mini App button doesn't work

**Solutions:**
- Verify URL is correct and accessible
- Ensure HTTPS is enabled
- Check if Telegram can access your URL
- Try `/deleteapp` and recreate

### Telegram SDK Not Working

**Problem**: `window.Telegram.WebApp` is undefined

**Solutions:**
- Ensure script tag is included: `<script src="https://telegram.org/js/telegram-web-app.js"></script>`
- Check browser console for loading errors
- Verify app is opened through Telegram (not direct browser access)

### Audio Upload Not Working

**Problem**: Can't upload or play audio files

**Solutions:**
- Check file size limits (10MB default)
- Verify audio format support
- Ensure Web Audio API is supported
- Check browser console for errors

### Backend API Not Reachable

**Problem**: Advanced analysis doesn't work

**Solutions:**
- Verify backend is deployed and running
- Check CORS configuration
- Ensure backend URL is correct in code
- Test API endpoint directly

## Advanced Configuration

### Environment Variables (Backend)

If using backend API, configure these:

```env
FLASK_ENV=production
CORS_ORIGINS=https://your-frontend-url.com
MAX_FILE_SIZE=10485760
```

### Custom Domain

To use a custom domain:

1. Configure your hosting provider
2. Set up DNS records
3. Enable HTTPS (Let's Encrypt, Cloudflare)
4. Update Web App URL in @BotFather

### Analytics

Add analytics to track usage:

```javascript
// In js/app.js
window.Telegram.WebApp.sendData(JSON.stringify({
    event: 'game_complete',
    score: finalScore
}));
```

## Best Practices

### 1. Performance
- Optimize assets (minify CSS/JS)
- Use CDN for static files
- Compress images
- Lazy load resources

### 2. User Experience
- Show loading states
- Handle errors gracefully
- Provide helpful error messages
- Test on different devices

### 3. Security
- Validate file uploads
- Implement rate limiting
- Sanitize user input
- Use HTTPS everywhere

### 4. Telegram Integration
- Use haptic feedback for better UX
- Respect Telegram's theme colors
- Handle WebApp lifecycle events
- Test in both mobile and desktop Telegram

## Monitoring

### Track Key Metrics

- Games played
- Average score
- Upload success rate
- Error rates
- User retention

### Error Tracking

Add error logging:

```javascript
window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
    // Send to logging service
});
```

## Resources

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [BotFather Commands](https://core.telegram.org/bots#6-botfather)
- [WebApp API Reference](https://core.telegram.org/bots/webapps#initializing-mini-apps)
- [Mini App Examples](https://github.com/telegram-mini-apps)

## Getting Help

- **Issues**: Create an issue on GitHub
- **Telegram**: Join relevant Telegram groups
- **Documentation**: Check official Telegram docs

## Example Bot Configuration

Here's a complete example configuration:

```yaml
bot:
  name: TapSync
  username: tapsync_game_bot
  description: "Rhythm game with dynamic beatmaps"
  
mini_app:
  title: TapSync
  url: https://tapsync.netlify.app
  short_description: "Upload music and play!"
  
commands:
  - command: start
    description: Start TapSync game
  - command: help
    description: Show game instructions
  - command: about
    description: About TapSync
    
menu_button:
  type: web_app
  text: Play TapSync
  url: https://tapsync.netlify.app
```

## Next Steps

After setup:

1. Share your bot with friends
2. Gather feedback
3. Iterate on features
4. Monitor usage
5. Optimize performance

Good luck with your TapSync Mini App! 🎵🎮
