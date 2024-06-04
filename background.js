chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ time: 1500, isRunning: false });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pomodoroTimer') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Pomodoro Timer',
      message: 'Time is up! Take a break or start a new session.',
      priority: 2
    });

    chrome.storage.local.set({ isRunning: false });
  }
});
