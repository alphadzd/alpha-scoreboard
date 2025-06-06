const activityIcons = {
    'storerobbery': 'fa-store',
    'bankrobbery': 'fa-university',
    'jewellery': 'fa-gem',
    'pacific': 'fa-landmark',
    'paleto': 'fa-building-columns',
    'fleeca': 'fa-credit-card',
    'bobcat': 'fa-shield-alt',
    'yacht': 'fa-ship',
    'humane': 'fa-flask',
    'drugdealer': 'fa-pills',
    'casino': 'fa-dice',
    'default': 'fa-exclamation-triangle'
};

const statusText = {
    'available': 'Available',
    'busy': 'In Progress',
    'unavailable': 'Unavailable'
};

function updateServerTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    const timeElement = document.getElementById('server-time');
    if (timeElement) {
        const separator = seconds % 2 === 0 ? ':' : ' ';
        timeElement.textContent = `${hours}${separator}${minutes}`;
    }
}

setInterval(updateServerTime, 1000);
updateServerTime();

window.addEventListener("message", (event) => {
    if (!event.data) return;
    
    switch (event.data.action) {
        case "open":
            open(event.data);
            break;
        case "close":
            close();
            break;
        case "setup":
            setup(event.data);
            break;
        default:
            console.log('Unknown action received:', event.data.action);
            break;
    }
});

const open = (data) => {
    console.log('Opening scoreboard with data:', data);
    
    const scoreboard = document.querySelector(".scoreboard-block");
    if (!scoreboard) return;
    
    scoreboard.style.display = "block";
    
    setTimeout(() => {
        scoreboard.classList.add("visible");
    }, 10);
    
    const totalPlayers = document.getElementById("total-players");
    if (totalPlayers) {
        totalPlayers.classList.add("animate-update");
        totalPlayers.textContent = `${data.players}/${data.maxPlayers}`;
        
        setTimeout(() => {
            totalPlayers.classList.remove("animate-update");
        }, 500);
    }
    
    const policeCount = document.getElementById("police-count");
    if (policeCount) {
        console.log("Police count received:", data.currentCops);
        
        policeCount.classList.add("animate-update");
        
        const cops = data.currentCops !== undefined && data.currentCops !== null ? data.currentCops : 0;
        policeCount.textContent = cops;
        
        setTimeout(() => {
            policeCount.classList.remove("animate-update");
        }, 500);
    }
    
    if (data.requiredCops) {
        Object.entries(data.requiredCops).forEach(([category, info], index) => {
            setTimeout(() => {
                updateActivityStatus(category, info, data.currentCops);
            }, 50 * index);
        });
    }
};

const updateActivityStatus = (category, info, currentCops) => {
    const beam = document.querySelector(`.scoreboard-info [data-type="${category}"]`);
    if (!beam) return;
    
    const status = beam.querySelector(".info-beam-status");
    if (!status) return;
    
    status.classList.remove("status-available", "status-busy", "status-unavailable");
    
    beam.classList.add("updating");
    
    if (info.busy) {
        status.innerHTML = `<i class="fas fa-spinner"></i>`;
        status.classList.add("status-busy");
    } else if (currentCops >= info.minimumPolice) {
        status.innerHTML = `<i class="fas fa-check-circle"></i>`;
        status.classList.add("status-available");
    } else {
        status.innerHTML = `<i class="fas fa-times-circle"></i>`;
        status.classList.add("status-unavailable");
    }
    
    setTimeout(() => {
        beam.classList.remove("updating");
    }, 500);
};

const close = () => {
    const scoreboard = document.querySelector(".scoreboard-block");
    if (!scoreboard) return;
    
    scoreboard.classList.remove("visible");
    
    setTimeout(() => {
        scoreboard.style.display = "none";
    }, 300);
};

const setup = (data) => {
    console.log('Setting up scoreboard with data:', data);
    
    const scoreboardInfo = document.querySelector(".scoreboard-info");
    if (!scoreboardInfo) return;
    
    scoreboardInfo.innerHTML = "";
    
    if (data.items) {
        Object.entries(data.items).forEach(([index, value], i) => {
            const beamElement = document.createElement("div");
            beamElement.className = "scoreboard-info-beam";
            beamElement.setAttribute("data-type", index);
            
            const icon = activityIcons[index] || activityIcons.default;
            
            const titleElement = document.createElement("div");
            titleElement.className = "info-beam-title";
            titleElement.innerHTML = `<i class="fas ${icon}"></i><p>${value}</p>`;
            
            const statusElement = document.createElement("div");
            statusElement.className = "info-beam-status";
            statusElement.innerHTML = '<i class="fas fa-circle-notch"></i>';
            
            beamElement.appendChild(titleElement);
            beamElement.appendChild(statusElement);
            scoreboardInfo.appendChild(beamElement);
            
            setTimeout(() => {
                beamElement.style.opacity = "1";
                beamElement.style.transform = "translateY(0)";
            }, 50 * i);
        });
    }
    
    updateServerTime();
};

window.addEventListener('error', (event) => {
    console.error('Error caught:', event.error);
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('Scoreboard UI initialized');
    updateServerTime();
    
    document.body.classList.add('smooth-animations');
    
    const iconPreload = document.createElement('div');
    iconPreload.style.position = 'absolute';
    iconPreload.style.opacity = '0';
    iconPreload.style.pointerEvents = 'none';
    iconPreload.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <i class="fas fa-times-circle"></i>
        <i class="fas fa-spinner"></i>
        <i class="fas fa-circle-notch"></i>
    `;
    document.body.appendChild(iconPreload);
    
    setTimeout(() => {
        document.body.removeChild(iconPreload);
    }, 1000);
});
