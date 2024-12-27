# MMM-DynamicSnow

A MagicMirror² module that adds weather-reactive snow effects. Evolved from MMM-SnowEffect, this version automatically activates based on current weather conditions!

Version: 3.0.0 (Previously MMM-SnowEffect v2.0.1)

## What's New in MMM-DynamicSnow

This module is a significant evolution of the original MMM-SnowEffect, adding intelligent weather-based activation:

### Major New Features
- Automatic snow effect activation based on weather conditions
- Integration with weather module notifications
- Smart weather type detection for snow, sleet, and related conditions
- Dynamic state management (activate/deactivate based on weather)
- Improved performance and resource management

## Changelog

### v3.0.0 (2024-12-27) - The Dynamic Update
- Renamed module to MMM-DynamicSnow
- Added weather-reactive snow effect activation
- Integrated with weather module notifications
- Added dynamic weather condition detection
- Improved resource management (snow only shows when relevant)
- Maintained all original snow effect features

### Previous Versions (as MMM-SnowEffect)
- v2.0.1: Performance optimization and configuration simplification
- v2.0.0: Configuration and validation improvements
- v1.0.0: Initial release with basic snow effects

## How It Works

MMM-DynamicSnow listens to your weather module's updates and automatically activates when:
- Snow is detected in the weather conditions
- Sleet is reported
- Blizzard conditions are present
- Snow flurries are occurring

The effect automatically deactivates when these conditions are no longer present.

## Custom Weather Keywords

The module includes a `snowKeywords.json` file that defines which weather conditions trigger the snow effect. You can customize this file to match your weather provider's terminology:

```json
{
    "snowKeywords": [
        "snow",
        "sleet",
        "blizzard",
        "flurries"
    ]
}
```

### Customizing Weather Detection

1. Locate the `snowKeywords.json` file in your module directory
2. Add or modify keywords to match your weather provider
3. Keywords are case-insensitive
4. Changes take effect immediately, no restart required

Common additions might include:
- "winter_storm"
- "snow_showers"
- "light_snow"
- "heavy_snow"
- "snow_grains"

## Installation

### Step 1: Clone the Module
```bash
cd ~/MagicMirror/modules
git clone https://github.com/cgillinger/MMM-DynamicSnow.git
```

### Step 2: Configure Module
Add to your `config/config.js`. The module requires two key components:
1. A weather module that emits weather notifications
2. The MMM-DynamicSnow configuration

Example configuration:

```javascript
{
    module: "MMM-DynamicSnow",
    position: "fullscreen_above",    // Required position
    config: {
        // Optional: Override automatic activation
        snow: true,                  // Set to false to disable regardless of weather
        
        // Visual customization
        flakeCount: 25,             // Number of snowflakes
        characters: ['*', '+'],      // Snowflake characters
        sparkleEnabled: false,       // Sparkle effect
        minSize: 0.8,               // Minimum flake size
        maxSize: 1.5,               // Maximum flake size
        speed: 1.0                  // Animation speed
    }
}
```

### Step 3: Weather Module Requirement
Ensure you have a weather module configured and working. The default weather module or most third-party weather modules will work.

## Configuration Options

| Option | Description | Default | Notes |
|--------|-------------|---------|--------|
| `snow` | Manual override | false | Set true to always show, false for weather-reactive |
| `flakeCount` | Number of flakes | 25 | Range: 1-100 |
| `speed` | Fall speed | 1.0 | Range: 0.1-5.0 |
| `minSize` | Min flake size | 0.8 | In rem units |
| `maxSize` | Max flake size | 1.5 | In rem units |
| `characters` | Flake styles | ['*', '+'] | Array of characters |
| `sparkleEnabled` | Sparkle effect | false | Visual enhancement |

## Performance Notes

### Low-Power Devices (e.g., Raspberry Pi)
```javascript
{
    module: "MMM-DynamicSnow",
    position: "fullscreen_above",
    config: {
        flakeCount: 15,          // Reduced count
        characters: ['*', '+'],   // Simple characters
        sparkleEnabled: false,    // No sparkle
        minSize: 0.8,
        maxSize: 1.2             // Smaller max size
    }
}
```

### Powerful Devices
```javascript
{
    module: "MMM-DynamicSnow",
    position: "fullscreen_above",
    config: {
        flakeCount: 40,
        characters: ['❄', '❆', '*'],
        sparkleEnabled: true,
        minSize: 1.0,
        maxSize: 2.0
    }
}
```

## Troubleshooting

### Common Issues

1. **Snow Not Activating**
   - Check weather module is properly configured
   - Verify weather notifications are being sent
   - Try manual activation (set `snow: true`)
   - Check console for weather type notifications

2. **Performance Issues**
   - Reduce `flakeCount`
   - Disable sparkle effect
   - Use simple characters
   - Reduce size range

3. **Weather Detection Issues**
   - Check weather module configuration
   - Verify weather data includes condition types
   - Check console for weather notifications
   - Verify snowKeywords.json matches your weather provider's terminology
   - Try adding additional keywords that match your weather service

## Compatibility
- MagicMirror²: >= 2.20.0
- Weather Module: Any that emits weather type notifications
- Browsers: All modern browsers supported

## Contributing
Issues and pull requests are welcome at [MMM-DynamicSnow Issues](https://github.com/cgillinger/MMM-DynamicSnow/issues)

## Credits
- Original MMM-SnowEffect by Christian Gillinger
- Weather integration enhancements by Christian Gillinger
- Based on MagicMirror² by Michael Teeuw

## License
MIT Licensed - See LICENSE file for details
