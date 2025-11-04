// Simple interactive demo
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('demoButton');
    const message = document.getElementById('message');
    let clickCount = 0;

    button.addEventListener('click', function() {
        clickCount++;
        
        const messages = [
            '🎉 Great job! You clicked the button!',
            '✨ JavaScript is working perfectly!',
            '🚀 Your web server is fully functional!',
            '💡 You can now build amazing things!',
            `🎯 You've clicked ${clickCount} times!`
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        message.textContent = randomMessage;
        
        // Add a fade-in animation
        message.style.opacity = '0';
        setTimeout(() => {
            message.style.opacity = '1';
            message.style.transition = 'opacity 0.5s ease';
        }, 10);
    });

    // Log to console when page loads
    console.log('🎊 Web server is running successfully!');
    console.log('👋 Check out the browser console - JavaScript is working!');
});
