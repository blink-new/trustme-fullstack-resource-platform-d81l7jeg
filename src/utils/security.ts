// Security utilities to prevent unauthorized access to content

export const disableDevTools = () => {
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+I (Inspector)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+C (Element Inspector)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+S (Save Page)
    if (e.ctrlKey && e.keyCode === 83) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+A (Select All)
    if (e.ctrlKey && e.keyCode === 65) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+P (Print)
    if (e.ctrlKey && e.keyCode === 80) {
      e.preventDefault();
      return false;
    }
  });

  // Disable text selection
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable drag and drop
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable image dragging
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable copy
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable cut
  document.addEventListener('cut', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable paste
  document.addEventListener('paste', (e) => {
    e.preventDefault();
    return false;
  });

  // Detect DevTools opening
  const devtools = {
    open: false,
    orientation: null as string | null
  };

  const threshold = 160;

  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        // Redirect or show warning
        document.body.innerHTML = `
          <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            font-size: 24px;
            z-index: 999999;
          ">
            <div style="text-align: center;">
              <h1>Access Denied</h1>
              <p>Developer tools are not allowed on this site.</p>
              <p>Please close developer tools and refresh the page.</p>
            </div>
          </div>
        `;
      }
    } else {
      devtools.open = false;
    }
  }, 500);

  // Disable console
  if (typeof console !== 'undefined') {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.clear = () => {};
    console.dir = () => {};
    console.dirxml = () => {};
    console.table = () => {};
    console.trace = () => {};
    console.group = () => {};
    console.groupCollapsed = () => {};
    console.groupEnd = () => {};
    console.time = () => {};
    console.timeEnd = () => {};
    console.timeStamp = () => {};
    console.profile = () => {};
    console.profileEnd = () => {};
    console.count = () => {};
    console.exception = () => {};
    console.assert = () => {};
  }

  // Clear console periodically
  setInterval(() => {
    if (typeof console !== 'undefined' && console.clear) {
      console.clear();
    }
  }, 1000);
};

// Disable screenshot functionality
export const disableScreenshots = () => {
  // Add CSS to prevent screenshots
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent !important;
    }
    
    img {
      -webkit-user-drag: none !important;
      -khtml-user-drag: none !important;
      -moz-user-drag: none !important;
      -o-user-drag: none !important;
      user-drag: none !important;
      pointer-events: none !important;
    }
    
    /* Prevent print screen */
    @media print {
      * {
        display: none !important;
      }
      body::after {
        content: "Printing is not allowed on this website.";
        display: block !important;
        font-size: 24px;
        text-align: center;
        margin-top: 50px;
      }
    }
  `;
  document.head.appendChild(style);

  // Detect print screen attempts
  document.addEventListener('keyup', (e) => {
    if (e.keyCode === 44) { // Print Screen key
      alert('Screenshots are not allowed on this website.');
    }
  });

  // Blur content when window loses focus (potential screenshot)
  let blurTimeout: NodeJS.Timeout;
  
  window.addEventListener('blur', () => {
    document.body.style.filter = 'blur(10px)';
    document.body.style.pointerEvents = 'none';
    
    // Show warning overlay
    const overlay = document.createElement('div');
    overlay.id = 'screenshot-warning';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      font-size: 20px;
      z-index: 999999;
      text-align: center;
    `;
    overlay.innerHTML = `
      <div>
        <h2>Content Protected</h2>
        <p>This content is protected against unauthorized access.</p>
        <p>Click here to continue viewing.</p>
      </div>
    `;
    
    overlay.addEventListener('click', () => {
      document.body.style.filter = '';
      document.body.style.pointerEvents = '';
      overlay.remove();
    });
    
    document.body.appendChild(overlay);
  });

  window.addEventListener('focus', () => {
    clearTimeout(blurTimeout);
    blurTimeout = setTimeout(() => {
      document.body.style.filter = '';
      document.body.style.pointerEvents = '';
      const overlay = document.getElementById('screenshot-warning');
      if (overlay) {
        overlay.remove();
      }
    }, 100);
  });
};

// Watermark overlay for premium content
export const addWatermark = (text: string = 'Trustme - Premium Content') => {
  const watermark = document.createElement('div');
  watermark.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 48px;
    color: rgba(0, 0, 0, 0.1);
    font-weight: bold;
    pointer-events: none;
    z-index: 999998;
    white-space: nowrap;
    font-family: Arial, sans-serif;
  `;
  watermark.textContent = text;
  document.body.appendChild(watermark);

  // Add multiple watermarks for better coverage
  for (let i = 0; i < 5; i++) {
    const clone = watermark.cloneNode(true) as HTMLElement;
    clone.style.top = `${20 + i * 20}%`;
    clone.style.left = `${10 + i * 20}%`;
    document.body.appendChild(clone);
  }
};

// Initialize all security measures
export const initializeSecurity = () => {
  // Only enable in production or when specifically requested
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SECURITY === 'true') {
    disableDevTools();
    disableScreenshots();
  }
};

// Content protection for premium items
export const protectPremiumContent = (element: HTMLElement, itemName: string) => {
  // Add protection overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial, sans-serif;
    font-size: 18px;
    z-index: 1000;
    cursor: pointer;
  `;
  
  overlay.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <h3>🔒 Premium Content</h3>
      <p>Purchase "${itemName}" to access full content</p>
      <button style="
        background: #2563EB;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 10px;
      ">
        Purchase Now
      </button>
    </div>
  `;
  
  element.style.position = 'relative';
  element.appendChild(overlay);
  
  return overlay;
};