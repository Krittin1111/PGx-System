// Tab Management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// Barcode Scanner Functionality
class BarcodeScanner {
    constructor() {
        this.isScanning = false;
        this.startBtn = document.getElementById('start-scanner');
        this.stopBtn = document.getElementById('stop-scanner');
        this.scanOutput = document.getElementById('scan-output');
        this.copyBtn = document.getElementById('copy-result');
        
        this.initializeScanner();
    }
    
    initializeScanner() {
        this.startBtn.addEventListener('click', () => this.startScanning());
        this.stopBtn.addEventListener('click', () => this.stopScanning());
        this.copyBtn.addEventListener('click', () => this.copyResult());
    }
    
    startScanning() {
        if (this.isScanning) return;
        
        this.startBtn.disabled = true;
        this.startBtn.innerHTML = '<span class="loading"></span>Starting...';
        
        // Check if camera is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.showError('Camera access is not supported in this browser.');
            this.resetButtons();
            return;
        }
        
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#camera-preview'),
                constraints: {
                    width: 640,
                    height: 480,
                    facingMode: "environment" // Back camera
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: 2,
            frequency: 10,
            decoder: {
                readers: [
                    "code_128_reader",
                    "ean_reader",
                    "ean_8_reader",
                    "code_39_reader",
                    "code_39_vin_reader",
                    "codabar_reader",
                    "upc_reader",
                    "upc_e_reader",
                    "i2of5_reader"
                ]
            },
            locate: true
        }, (err) => {
            if (err) {
                console.error('QuaggaJS initialization error:', err);
                this.showError('Failed to initialize camera: ' + err.message);
                this.resetButtons();
                return;
            }
            
            console.log("QuaggaJS initialized successfully");
            Quagga.start();
            this.isScanning = true;
            
            this.startBtn.style.display = 'none';
            this.stopBtn.disabled = false;
            this.stopBtn.style.display = 'inline-block';
            
            // Listen for successful scans
            Quagga.onDetected((result) => {
                const code = result.codeResult.code;
                console.log('Barcode detected:', code);
                this.displayResult(code);
                
                // Optional: Stop after first successful scan
                // this.stopScanning();
            });
        });
    }
    
    stopScanning() {
        if (!this.isScanning) return;
        
        Quagga.stop();
        this.isScanning = false;
        this.resetButtons();
        
        // Clear the camera preview
        const preview = document.getElementById('camera-preview');
        preview.innerHTML = '';
    }
    
    displayResult(code) {
        this.scanOutput.textContent = code;
        this.scanOutput.style.backgroundColor = '#d4edda';
        this.scanOutput.style.borderColor = '#c3e6cb';
        this.copyBtn.style.display = 'inline-block';
        
        // Play success sound (if available)
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgCDOGzPLNeSsFQ==');
            audio.play().catch(() => {});
        } catch (e) {}
    }
    
    copyResult() {
        const text = this.scanOutput.textContent;
        if (text && text !== 'No barcode scanned yet') {
            navigator.clipboard.writeText(text).then(() => {
                this.copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    this.copyBtn.textContent = 'Copy Result';
                }, 2000);
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                this.copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    this.copyBtn.textContent = 'Copy Result';
                }, 2000);
            });
        }
    }
    
    showError(message) {
        this.scanOutput.textContent = 'Error: ' + message;
        this.scanOutput.style.backgroundColor = '#f8d7da';
        this.scanOutput.style.borderColor = '#f5c6cb';
        this.copyBtn.style.display = 'none';
    }
    
    resetButtons() {
        this.startBtn.disabled = false;
        this.startBtn.innerHTML = 'Start Scanner';
        this.startBtn.style.display = 'inline-block';
        this.stopBtn.disabled = true;
        this.stopBtn.style.display = 'none';
    }
}

// Barcode Generator Functionality
class BarcodeGenerator {
    constructor() {
        this.textInput = document.getElementById('barcode-text');
        this.formatSelect = document.getElementById('barcode-format');
        this.generateBtn = document.getElementById('generate-barcode');
        this.canvas = document.getElementById('barcode-canvas');
        this.saveBtn = document.getElementById('save-barcode');
        this.printBtn = document.getElementById('print-barcode');
        
        this.initializeGenerator();
    }
    
    initializeGenerator() {
        this.generateBtn.addEventListener('click', () => this.generateBarcode());
        this.saveBtn.addEventListener('click', () => this.saveBarcode());
        this.printBtn.addEventListener('click', () => this.printBarcode());
        
        // Generate initial barcode
        this.generateBarcode();
    }
    
    generateBarcode() {
        const text = this.textInput.value.trim();
        const format = this.formatSelect.value;
        
        if (!text) {
            this.showError('Please enter text to encode');
            return;
        }
        
        try {
            // Clear previous barcode
            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Generate new barcode
            JsBarcode(this.canvas, text, {
                format: format,
                width: 2,
                height: 100,
                displayValue: true,
                fontSize: 16,
                textMargin: 10,
                margin: 10
            });
            
            // Show action buttons
            this.saveBtn.style.display = 'inline-block';
            this.printBtn.style.display = 'inline-block';
            
            console.log('Barcode generated:', text, format);
            
        } catch (error) {
            console.error('Barcode generation error:', error);
            this.showError('Failed to generate barcode: ' + error.message);
        }
    }
    
    saveBarcode() {
        try {
            // Create download link
            const link = document.createElement('a');
            link.download = 'barcode-' + Date.now() + '.png';
            link.href = this.canvas.toDataURL();
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Visual feedback
            const originalText = this.saveBtn.textContent;
            this.saveBtn.textContent = 'Saved!';
            setTimeout(() => {
                this.saveBtn.textContent = originalText;
            }, 2000);
            
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save barcode');
        }
    }
    
    printBarcode() {
        try {
            // Create print window
            const printWindow = window.open('', '_blank');
            const canvas = this.canvas;
            const dataUrl = canvas.toDataURL();
            
            printWindow.document.write(`
                <html>
                <head>
                    <title>Print Barcode</title>
                    <style>
                        body { 
                            margin: 0; 
                            padding: 20px; 
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            min-height: 100vh;
                        }
                        img { 
                            max-width: 100%; 
                            height: auto; 
                        }
                    </style>
                </head>
                <body>
                    <img src="${dataUrl}" alt="Barcode">
                </body>
                </html>
            `);
            
            printWindow.document.close();
            
            // Wait for image to load then print
            printWindow.onload = function() {
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 500);
            };
            
        } catch (error) {
            console.error('Print error:', error);
            alert('Failed to print barcode');
        }
    }
    
    showError(message) {
        alert(message); // You can replace this with a custom modal if needed
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (!user.email && !user.id) {
        // No user logged in, redirect to login page
        window.location.href = "./login.html";
        return;
    }
    
    // Initialize scanner and generator
    const scanner = new BarcodeScanner();
    const generator = new BarcodeGenerator();
    
    console.log('Barcode system initialized for user:', user.firstname || 'Unknown');
});