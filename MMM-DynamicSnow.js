/* MagicMirror²
 * Module: MMM-DynamicSnow
 * 
 * By Christian Gillinger
 * MIT Licensed.
 * 
 * v3.0.1 (2024-12-27)
 * 
 * Changelog:
 * v3.0.1 (2024-12-27)
 * - Fixed snow animation implementation
 * - Restored original working animation code
 * - Added proper snowKeywords.json loading
 * 
 * v3.0.0 (2024-12-27)
 * - Renamed to MMM-DynamicSnow
 * - Added weather-reactive snow effect activation
 * - Integrated weather module notifications
 * - Added dynamic handling for weather notifications
 * 
 * v2.0.1 (2024-12-16)
 * - Removed performance presets system
 * - Simplified configuration with direct values
 * - Updated validation logic
 * 
 * v2.0.0 (2024-12-16)
 * - Configuration improvements
 * 
 * v1.0.0 (2024-12-01)
 * - Initial release
 */

Module.register("MMM-DynamicSnow", {
    // Default configuration - all can be overridden in config.js
    defaults: {
        snow: false,          // Enable/disable snow effect (default: off)
        flakeCount: 25,       // Default count for light performance
        speed: 1.0,           // Speed multiplier (1 = normal speed)
        minSize: 0.8,         // Default minimum size
        maxSize: 1.5,         // Default maximum size
        characters: ['*', '+'], // Default characters (light mode style)
        sparkleEnabled: false  // Sparkle effect disabled by default
    },

    // Store for loaded keywords with defaults
    snowKeywords: ["snow", "sleet", "blizzard", "flurries"],

    start: function () {
        this.snowEffectActive = false;
        this.validateConfig();
        Log.info("MMM-DynamicSnow: Module initialized and requesting keywords.");
        this.sendSocketNotification("REQUEST_KEYWORDS");
    },

    validateConfig: function () {
        if (typeof this.config.flakeCount !== "number" || this.config.flakeCount < 1) {
            Log.warn("MMM-DynamicSnow: Invalid flakeCount. Using default: 25");
            this.config.flakeCount = 25;
        }

        if (typeof this.config.speed !== "number" || this.config.speed <= 0) {
            Log.warn("MMM-DynamicSnow: Invalid speed. Using default: 1.0");
            this.config.speed = 1.0;
        }

        if (typeof this.config.minSize !== "number" || this.config.minSize <= 0) {
            Log.warn("MMM-DynamicSnow: Invalid minSize. Using default: 0.8");
            this.config.minSize = 0.8;
        }

        if (typeof this.config.maxSize !== "number" || this.config.maxSize <= this.config.minSize) {
            Log.warn("MMM-DynamicSnow: Invalid maxSize. Using default: 1.5");
            this.config.maxSize = 1.5;
        }
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "SNOW_KEYWORDS_LOADED") {
            this.snowKeywords = payload;
            Log.info("MMM-DynamicSnow: Updated snow keywords:", this.snowKeywords);
        }
    },

    notificationReceived: function (notification, payload) {
        if (notification === "CURRENTWEATHER_TYPE" && payload && payload.type) {
            const weatherType = payload.type.toLowerCase();
            Log.info(`MMM-DynamicSnow: Received weather type: ${weatherType}`);

            const isSnowy = this.snowKeywords.includes(weatherType);

            if (isSnowy && !this.snowEffectActive) {
                this.activateSnowEffect();
            } else if (!isSnowy && this.snowEffectActive) {
                this.deactivateSnowEffect();
            }
        }
    },

    activateSnowEffect: function () {
        this.snowEffectActive = true;
        this.startSnowAnimation();
        Log.info("MMM-DynamicSnow: Snow effect activated.");
    },

    deactivateSnowEffect: function () {
        this.snowEffectActive = false;
        this.stopSnowAnimation();
        Log.info("MMM-DynamicSnow: Snow effect deactivated.");
    },

    startSnowAnimation: function () {
        const snowContainer = document.createElement("div");
        snowContainer.id = "snowEffectContainer";
        snowContainer.style.position = "fixed";
        snowContainer.style.top = "0";
        snowContainer.style.left = "0";
        snowContainer.style.width = "100%";
        snowContainer.style.height = "100%";
        snowContainer.style.pointerEvents = "none";
        snowContainer.style.zIndex = "9999";

        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `
            @keyframes snow {
                from { transform: translateY(-10px); }
                to { transform: translateY(100vh); }
            }

            .snowflake {
                position: absolute;
                top: 0;
                color: white;
                font-size: 1em;
                animation: snow 5s linear infinite;
            }
        `;
        document.head.appendChild(style);

        for (let i = 0; i < this.config.flakeCount; i++) {
            const snowflake = document.createElement("div");
            snowflake.className = "snowflake";
            snowflake.innerHTML = this.getRandomCharacter();
            snowflake.style.left = Math.random() * 100 + "%";
            snowflake.style.animationDuration = (Math.random() * 2 + 3) / this.config.speed + "s";
            snowflake.style.fontSize = Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize + "em";
            snowContainer.appendChild(snowflake);
        }

        document.body.appendChild(snowContainer);
        Log.info("MMM-DynamicSnow: Snow animation started.");
    },

    getRandomCharacter: function () {
        const characters = this.config.characters;
        return characters[Math.floor(Math.random() * characters.length)];
    },

    stopSnowAnimation: function () {
        const snowContainer = document.getElementById("snowEffectContainer");
        if (snowContainer) {
            snowContainer.remove();
            Log.info("MMM-DynamicSnow: Snow animation stopped.");
        }
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.style.display = "none";
        return wrapper;
    }
});
