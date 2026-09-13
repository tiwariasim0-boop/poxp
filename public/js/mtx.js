/**
 * Simulated Attacker Tracking Script
 * Recreating the malicious mtx.js behavior found in x2.html
 */
(function() {
    console.log("[MTX Tracker] Initializing simulated attacker script...");

    // Find the script tag that loaded this file to extract the data-domain attribute
    const currentScript = document.currentScript || document.querySelector('script[src*="mtx.js"]');
    const attackerDomain = currentScript ? currentScript.getAttribute('data-domain') : 'unknown';
    
    console.log(`[MTX Tracker] Target Attacker Domain extracted: ${attackerDomain}`);

    // Gather system telemetry (simulating what the attacker collects)
    const telemetry = {
        target_domain: attackerDomain,
        user_agent: navigator.userAgent,
        language: navigator.language,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hardware_concurrency: navigator.hardwareConcurrency || 'unknown',
        device_memory: navigator.deviceMemory || 'unknown',
        platform: navigator.platform
    };

    // Instead of sending it to the attacker's DDNS, we send it to our local Investigation Dashboard Backend
    fetch('/api/analytics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            source: 'attacker_ddns_tracker',
            event_type: 'telemetry_ping',
            data: telemetry
        })
    }).then(() => {
        console.log("[MTX Tracker] Successfully captured attacker telemetry in local dashboard.");
    }).catch(err => {
        console.error("[MTX Tracker] Failed to log telemetry:", err);
    });
})();
