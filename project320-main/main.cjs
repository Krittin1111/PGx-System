const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
const { spawn } = require('child_process')

let splashWindow;
let mainWindow;
let serverProcess;

const createSplashWindow = () => {
  splashWindow = new BrowserWindow({
    fullscreen: true, // Make splash screen fullscreen
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: false,
    },
    show: false,
    backgroundColor: '#667eea', // Match the gradient start color
  })

  splashWindow.loadFile('src/splashscreen.html');
  splashWindow.center();
  
  // Show splash screen when ready
  splashWindow.once('ready-to-show', () => {
    console.log('🎬 Showing splash screen');
    splashWindow.show();
  });
}

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    fullscreen: true, // Open in fullscreen mode
    frame: false, // Remove window frame (no minimize/maximize/close buttons)
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      devTools: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
    },
    // Fix cursor disappearing issue
    show: false, // Don't show until ready
    backgroundColor: '#ECF5FD', // Match your CSS background
  })

  // Hide menu bar
  mainWindow.setMenuBarVisibility(false)

  mainWindow.loadFile('src/login.html');
  
  let isMainWindowReady = false;
  let splashStartTime = Date.now();
  const MINIMUM_SPLASH_TIME = 4000; // 4 seconds minimum display time
  
  // Track when main window is ready
  mainWindow.once('ready-to-show', () => {
    isMainWindowReady = true;
    checkIfReadyToShow();
  });
  
  // Function to check if we should show main window
  const checkIfReadyToShow = () => {
    const elapsedTime = Date.now() - splashStartTime;
    const remainingTime = MINIMUM_SPLASH_TIME - elapsedTime;
    
    if (isMainWindowReady && elapsedTime >= MINIMUM_SPLASH_TIME) {
      // Both conditions met: main window ready AND minimum time passed
      console.log('✅ Ready to show main window');
      showMainWindow();
    } else if (isMainWindowReady && remainingTime > 0) {
      // Main window ready but need to wait more time
      console.log(`⏱️ Splash screen will show for ${remainingTime}ms more...`);
      setTimeout(showMainWindow, remainingTime);
    }
  };
  
  // Function to show main window and close splash
  const showMainWindow = () => {
    console.log('🚀 Transitioning to main window');
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.destroy(); // Close the splash screen
    }
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show(); // Show the main window
    }
  };
  
  // Fallback: Force show after 6 seconds (in case something goes wrong)
  setTimeout(() => {
    if (!mainWindow.isVisible()) {
      console.log('Fallback: Forcing main window to show after 6 seconds');
      showMainWindow();
    }
  }, 6000);
  
  // mainWindow.webContents.openDevTools();
}

// Start the Node.js server
function startServer() {
  try {
    console.log('Starting server...');
    
    // Determine if we're in development or packaged mode
    const isDev = !app.isPackaged;
    let command, args, serverCwd;
    
    if (isDev) {
      // Development mode: use npm run server
      command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      args = ['run', 'server'];
      serverCwd = __dirname;
    } else {
      // Packaged mode: run server.js directly from extraResources using system Node.js
      command = 'node';
      args = [path.join(process.resourcesPath, 'server.js')];
      serverCwd = process.resourcesPath;
    }
    
    console.log('Server command:', command, args);
    console.log('Server CWD:', serverCwd);
    
    serverProcess = spawn(command, args, {
      stdio: 'inherit',
      cwd: serverCwd,
      env: { ...process.env, NODE_ENV: isDev ? 'development' : 'production' }
    });

    serverProcess.on('error', (err) => {
      console.error('Failed to start server:', err);
    });

    serverProcess.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
    });

    // Give server time to start
    return new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    console.error('Error starting server:', error);
    return Promise.resolve();
  }
}

// Stop the server when app closes
function stopServer() {
  if (serverProcess) {
    console.log('Stopping server...');
    serverProcess.kill();
    serverProcess = null;
  }
}

// Fix cursor disappearing issues
app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor');

app.whenReady().then(async () => {
  // Start the server first
  await startServer();
  
  // Then create windows
  createSplashWindow();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSplashWindow();
      createMainWindow();
    }
  })
})

app.on('window-all-closed', () => {
  stopServer(); // Stop server when app closes
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  stopServer(); // Ensure server is stopped before app quits
})