export function logEvent(message) {
  const eventConsole = document.getElementById('eventConsole');
  const timestamp = new Date().toLocaleTimeString();
  const eventLine = document.createElement('p');
  eventLine.textContent = `[${timestamp}] ${message}`;
  eventConsole.appendChild(eventLine);
  eventConsole.scrollTop = eventConsole.scrollHeight;
}
