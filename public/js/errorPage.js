const ERROR_MAP = {
  0:   { icon: 'wi-strong-wind',  headline: 'No Connection',      detail: 'Check your internet connection and try again.' },
  401: { icon: 'wi-na',           headline: 'API Key Missing',     detail: 'A required API key is not configured. Check environment variables.' },
  404: { icon: 'wi-fog',          headline: 'Location Not Found',  detail: "That place doesn't seem to exist. Try a different city name." },
  429: { icon: 'wi-cloudy',       headline: 'Too Many Requests',   detail: 'The weather service is rate limited right now. Wait a moment and try again.' },
  500: { icon: 'wi-thunderstorm', headline: 'Server Error',        detail: 'Something went wrong on our end. Please try again shortly.' },
};

const DEFAULT_ERROR = { icon: 'wi-cloudy', headline: 'Something Went Wrong', detail: 'An unexpected error occurred.' };

function errorPage(status, error) {
  const root = document.getElementById('root');
  const info = ERROR_MAP[status] ?? DEFAULT_ERROR;

  const icon = document.createElement('i');
  icon.className = `wi ${info.icon} error-icon`;

  const statusElem = document.createElement('p');
  statusElem.className = 'xl bold gray';
  statusElem.textContent = status ? String(status) : '!';

  const headline = document.createElement('p');
  headline.className = 'large bold';
  headline.textContent = info.headline;

  const detail = document.createElement('p');
  detail.className = 'small gray';
  detail.textContent = info.detail;

  const retryBtn = document.createElement('button');
  retryBtn.type = 'button';
  retryBtn.className = 'btn retry-btn';
  retryBtn.textContent = 'Try Again';
  retryBtn.addEventListener('click', () => window.location.reload());

  const card = document.createElement('div');
  card.className = 'error-card card flex-column';
  card.append(icon, statusElem, headline, detail);

  if (error) {
    const raw = document.createElement('p');
    raw.className = 'small gray';
    raw.textContent = error;
    card.appendChild(raw);
  }

  card.appendChild(retryBtn);

  root.replaceChildren(card);
  root.classList.remove('fade-out-slow');
}

export { errorPage };