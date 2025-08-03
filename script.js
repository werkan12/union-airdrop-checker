// Wallet Checker Dashboard Script

// Matrix Background Effect
class MatrixEffect {
    constructor() {
        this.canvas = document.getElementById('matrixCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.characters = ['K', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this.drops = [];
        this.fontSize = 14;
        this.columns = 0;
        this.rows = 0;
        
        this.init();
        this.animate();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Initialize drops
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = 1;
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.rows = Math.floor(this.canvas.height / this.fontSize);
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            this.ctx.fillText(char, x, y);
            
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Rank titles and levels
const rankTitles = [
    'Private', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain', 
    'Major', 'Colonel', 'Brigadier', 'General', 'Field Marshal'
];

const rankLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Mission data
const missionData = {
    totalMissions: 7,
    totalXP: 135
};

// Achievement data
const achievementData = {
    totalAchievements: 141,
    totalXP: 1290
};

// Reward data
const rewardData = {
    totalRewards: 32
};

// Wallet data
const walletData = {
    totalWallets: 1,
    cosmosWallets: 0,
    evmWallets: 1
};

// Function to generate random number between min and max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate random rank
function generateRandomRank() {
    const rankIndex = getRandomNumber(0, rankTitles.length - 1);
    const rankTitle = rankTitles[rankIndex];
    const rankLevel = rankLevels[rankIndex];
    
    // Generate next rank
    const nextRankIndex = Math.min(rankIndex + 1, rankTitles.length - 1);
    const nextRank = rankTitles[nextRankIndex];
    
    return {
        title: rankTitle,
        level: rankLevel,
        nextRank: nextRank,
        rankNumber: getRandomNumber(100000, 999999),
        totalXP: getRandomNumber(50, 2000),
        currentXP: getRandomNumber(10, 90),
        nextLevelXP: 100
    };
}

// New Token Distribution System
const TOTAL_TOKENS = 100000000; // 100 million tokens
const SEASON_WEIGHTS = {
    SEASON_1: 10,
    SEASON_2: 30
};

const SEASON_ALLOCATION = {
    SEASON_1: 0.25, // 25% of total tokens (25M)
    SEASON_2: 0.75  // 75% of total tokens (75M)
};

const RANKING_TIERS = [
    { minRank: 1, maxRank: 10, users: 10, share: 0.06 },     // 6% of season tokens
    { minRank: 11, maxRank: 50, users: 40, share: 0.15 },    // 15% of season tokens
    { minRank: 51, maxRank: 100, users: 50, share: 0.20 },   // 20% of season tokens
    { minRank: 101, maxRank: 300, users: 200, share: 0.25 }, // 25% of season tokens
    { minRank: 301, maxRank: 1000, users: 700, share: 0.34 } // 34% of season tokens
];

// Function to calculate token reward based on rank and season
function calculateTokenReward(season1Rank, season2Rank) {
    let totalReward = 0;
    let season1Reward = 0;
    let season2Reward = 0;
    let season1Eligible = false;
    let season2Eligible = false;
    
    // Only calculate rewards for users ranked 1-1000
    if (season1Rank >= 1 && season1Rank <= 1000) {
        season1Eligible = true;
        season1Reward = calculateSeasonReward(season1Rank, SEASON_ALLOCATION.SEASON_1);
    }
    
    if (season2Rank >= 1 && season2Rank <= 1000) {
        season2Eligible = true;
        season2Reward = calculateSeasonReward(season2Rank, SEASON_ALLOCATION.SEASON_2);
    }
    
    totalReward = season1Reward + season2Reward;
    
    return {
        tokens: totalReward,
        isHighRank: totalReward > 0,
        season1Eligible: season1Eligible,
        season2Eligible: season2Eligible,
        season1Reward: season1Reward,
        season2Reward: season2Reward,
        totalSupply: TOTAL_TOKENS,
        seasonAllocation: SEASON_ALLOCATION,
        rankingTiers: RANKING_TIERS
    };
}

// Function to calculate reward for a specific season
function calculateSeasonReward(rank, seasonAllocation) {
    if (rank < 1 || rank > 1000) return 0;
    
    // Find the tier for this rank
    const tier = RANKING_TIERS.find(t => rank >= t.minRank && rank <= t.maxRank);
    if (!tier) return 0;
    
    // Calculate tokens for this season
    const seasonTokens = TOTAL_TOKENS * seasonAllocation;
    
    // Calculate tokens for this tier
    const tierTokens = seasonTokens * tier.share;
    
    // Calculate tokens per user in this tier (floating point, no rounding)
    const tokensPerUser = tierTokens / tier.users;
    
    return tokensPerUser;
}

// Function to calculate season ranks based on user input
function calculateSeasonRanks(season1Ranking, season2Ranking) {
    return {
        season1: season1Ranking,
        season2: season2Ranking,
        season1Points: season1Ranking,
        season2Points: season2Ranking
    };
}

// Function to generate random stats
function generateRandomStats() {
    const completedMissions = getRandomNumber(1, missionData.totalMissions);
    const missionXP = getRandomNumber(50, missionData.totalXP);
    const missionCompletionRate = Math.round((completedMissions / missionData.totalMissions) * 100);
    
    const achievements = getRandomNumber(1, achievementData.totalAchievements);
    const achievementXP = getRandomNumber(10, achievementData.totalXP);
    const achievementCompletionRate = Math.round((achievements / achievementData.totalAchievements) * 100);
    
    const claimedRewards = getRandomNumber(1, rewardData.totalRewards);
    const queuedRewards = getRandomNumber(0, 5);
    const claimRate = Math.round((claimedRewards / rewardData.totalRewards) * 100);
    
    return {
        missions: {
            completed: completedMissions,
            total: missionData.totalMissions,
            xp: missionXP,
            completionRate: missionCompletionRate
        },
        achievements: {
            completed: achievements,
            total: achievementData.totalAchievements,
            xp: achievementXP,
            completionRate: achievementCompletionRate
        },
        rewards: {
            claimed: claimedRewards,
            total: rewardData.totalRewards,
            queued: queuedRewards,
            claimRate: claimRate
        }
    };
}

// Function to update UI with new data
function updateDashboard(rankData, statsData, seasonRanks, tokenReward) {
    // Update rank information
    document.getElementById('rankNumber').textContent = rankData.rankNumber;
    document.getElementById('totalXP').textContent = rankData.totalXP;
    document.getElementById('rankTitle').textContent = rankData.title;
    document.getElementById('rankLevel').textContent = `Level ${rankData.level}`;
    document.getElementById('nextRank').textContent = rankData.nextRank;
    document.getElementById('currentXP').textContent = rankData.currentXP;
    document.getElementById('nextLevelXP').textContent = rankData.nextLevelXP;
    
    // Update progress bar
    const progressPercentage = (rankData.currentXP / rankData.nextLevelXP) * 100;
    document.getElementById('progressFill').style.width = `${progressPercentage}%`;
    
    // Update season ranks and points
    document.getElementById('season1Rank').textContent = seasonRanks.season1;
    document.getElementById('season2Rank').textContent = seasonRanks.season2;
    document.getElementById('season1PointsDisplay').textContent = `${seasonRanks.season1Points} ranking`;
    document.getElementById('season2PointsDisplay').textContent = `${seasonRanks.season2Points} ranking`;
    
    // Update token reward
    const tokenRewardElement = document.getElementById('tokenReward');
    const tokenAmountElement = document.getElementById('tokenAmount');
    
    // Hide token reward in dashboard (only show in animation)
    tokenRewardElement.style.display = 'none';
    
    // Only update stats if user has high ranking (eligible for tokens)
    if (tokenReward.isHighRank) {
        // Update mission stats
        const missionStats = document.querySelector('.stats-card:nth-child(2)');
        missionStats.querySelector('.stat-value').textContent = `${statsData.missions.completed} / ${statsData.missions.total}`;
        missionStats.querySelector('.xp-current').textContent = statsData.missions.xp;
        missionStats.querySelector('.completion-rate').textContent = `${statsData.missions.completionRate}%`;
        missionStats.querySelector('.progress-fill').style.width = `${statsData.missions.completionRate}%`;
        
        // Update achievement stats
        const achievementStats = document.querySelector('.stats-card:nth-child(3)');
        achievementStats.querySelector('.stat-value').textContent = `${statsData.achievements.completed} / ${statsData.achievements.total}`;
        achievementStats.querySelector('.xp-current').textContent = statsData.achievements.xp;
        achievementStats.querySelector('.completion-rate').textContent = `${statsData.achievements.completionRate}%`;
        achievementStats.querySelector('.progress-fill').style.width = `${statsData.achievements.completionRate}%`;
        
        // Update reward stats
        const rewardStats = document.querySelector('.stats-card:nth-child(4)');
        rewardStats.querySelector('.stat-value').textContent = `${statsData.rewards.claimed} / ${statsData.rewards.total}`;
        rewardStats.querySelector('.xp-current').textContent = statsData.rewards.queued;
        rewardStats.querySelector('.completion-rate').textContent = `${statsData.rewards.claimRate}%`;
        rewardStats.querySelector('.progress-fill').style.width = `${statsData.rewards.claimRate}%`;
    } else {
        // Keep stats at zero for low ranking users
        const missionStats = document.querySelector('.stats-card:nth-child(2)');
        missionStats.querySelector('.stat-value').textContent = `0 / 7`;
        missionStats.querySelector('.xp-current').textContent = `0`;
        missionStats.querySelector('.completion-rate').textContent = `0%`;
        missionStats.querySelector('.progress-fill').style.width = `0%`;
        
        const achievementStats = document.querySelector('.stats-card:nth-child(3)');
        achievementStats.querySelector('.stat-value').textContent = `0 / 141`;
        achievementStats.querySelector('.xp-current').textContent = `0`;
        achievementStats.querySelector('.completion-rate').textContent = `0%`;
        achievementStats.querySelector('.progress-fill').style.width = `0%`;
        
        const rewardStats = document.querySelector('.stats-card:nth-child(4)');
        rewardStats.querySelector('.stat-value').textContent = `0 / 32`;
        rewardStats.querySelector('.xp-current').textContent = `0`;
        rewardStats.querySelector('.completion-rate').textContent = `0%`;
        rewardStats.querySelector('.progress-fill').style.width = `0%`;
    }
}

// Function to handle wallet check
function checkWallet() {
    console.log('Check wallet function called');
    const walletAddress = document.getElementById('walletAddress').value.trim();
    const xAccount = document.getElementById('xAccount').value.trim();
    const season1Points = parseInt(document.getElementById('season1Points').value) || 0;
    const season2Points = parseInt(document.getElementById('season2Points').value) || 0;
    
    if (!walletAddress) {
        alert('Please enter a wallet address');
        return;
    }
    
    if (!xAccount) {
        alert('Please enter your X account');
        return;
    }
    
    if (season1Points < 0 || season2Points < 0) {
        alert('Season points cannot be negative');
        return;
    }
    
    // Check if user is ranked above 1000
    if (season1Points > 1000 || season2Points > 1000) {
        alert('Only users ranked 1-1000 are eligible for tokens. Please enter a valid ranking.');
        return;
    }
    
    console.log('Wallet address:', walletAddress);
    console.log('X account:', xAccount);
    console.log('Season 1 points:', season1Points);
    console.log('Season 2 points:', season2Points);
    
    // Show loading state
    const checkBtn = document.getElementById('checkWallet');
    const originalText = checkBtn.textContent;
    checkBtn.textContent = 'Checking...';
    checkBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Generate random data
        const rankData = generateRandomRank();
        const statsData = generateRandomStats();
        const seasonRanks = calculateSeasonRanks(season1Points, season2Points);
        const tokenReward = calculateTokenReward(seasonRanks.season1, seasonRanks.season2);
        
        // Update dashboard
        updateDashboard(rankData, statsData, seasonRanks, tokenReward);
        
        // Reset button
        checkBtn.textContent = originalText;
        checkBtn.disabled = false;
        
        // Show token reward message if high rank
        if (tokenReward.isHighRank) {
            setTimeout(() => {
                showTokenWinAnimation(tokenReward.tokens);
            }, 1000);
        }
        
        // Redirect to Twitter after a short delay
        setTimeout(() => {
            console.log('Redirecting to Twitter...');
            try {
                window.open('https://x.com/KingandNFT', '_blank');
            } catch (error) {
                console.error('Twitter redirect failed:', error);
                // Fallback: try to redirect in same window
                window.location.href = 'https://x.com/KingandNFT';
            }
        }, 2000);
    }, 1500);
}

// Function to format large numbers with dots
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Function to show token win animation
function showTokenWinAnimation(tokenAmount) {
    // Create token win animation element
    const tokenWinElement = document.createElement('div');
    tokenWinElement.className = 'token-win-animation';
    
    // Check if manual logo is available
    const manualLogo = localStorage.getItem('unionLogo');
    
    // Format token amount with dots for readability
    const formattedAmount = formatNumber(Math.floor(tokenAmount));
    
    if (manualLogo) {
        // Use manual uploaded logo
        tokenWinElement.innerHTML = `
            <div class="token-win-logo">
                <img src="${manualLogo}" alt="UNION Logo" class="manual-logo">
            </div>
            <div class="token-win-amount">${formattedAmount} U</div>
            <div class="token-win-message">You earned tokens!</div>
        `;
    } else {
        // Use CSS logo
        tokenWinElement.innerHTML = `
            <div class="token-win-logo">
                <div class="union-logo">
                    <div class="middle-line">
                        <div class="square"></div>
                        <div class="square"></div>
                        <div class="square"></div>
                        <div class="square"></div>
                    </div>
                </div>
            </div>
            <div class="token-win-amount">${formattedAmount} U</div>
            <div class="token-win-message">You earned tokens!</div>
        `;
    }
    
    document.body.appendChild(tokenWinElement);
    
    // Remove after 8 seconds (much longer)
    setTimeout(() => {
        tokenWinElement.classList.add('hide');
        setTimeout(() => {
            if (document.body.contains(tokenWinElement)) {
                document.body.removeChild(tokenWinElement);
            }
        }, 300);
    }, 8000);
}

// Add some sample wallet addresses for testing
const sampleWallets = [
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    '0x1234567890123456789012345678901234567890',
    'cosmos1huydeevpz37sd9snkgul6070mjukukqfc8pw8v',
    'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
];

// Add sample wallet suggestions (optional)
function addSampleWallets() {
    const walletInput = document.getElementById('walletAddress');
    const datalist = document.createElement('datalist');
    datalist.id = 'sample-wallets';
    
    sampleWallets.forEach(wallet => {
        const option = document.createElement('option');
        option.value = wallet;
        datalist.appendChild(option);
    });
    
    document.body.appendChild(datalist);
    walletInput.setAttribute('list', 'sample-wallets');
}

// Function to upload team member image
function uploadTeamImage(memberId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageElement = document.getElementById(memberId);
                const placeholderElement = imageElement.nextElementSibling;
                
                imageElement.src = e.target.result;
                imageElement.style.display = 'block';
                placeholderElement.style.display = 'none';
                
                localStorage.setItem(memberId, e.target.result);
                alert('Team member image uploaded successfully!');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Function to add team image upload buttons
function addTeamImageUploads() {
    // Removed upload buttons - user will handle manually
    console.log('Team section ready for manual image uploads');
}

// Function to load saved team images
function loadTeamImages() {
    const devImage = localStorage.getItem('devAvatar');
    const kingImage = localStorage.getItem('kingAvatar');
    
    // Set default Dev image
    const devElement = document.getElementById('devAvatar');
    const devPlaceholder = devElement.nextElementSibling;
    
    if (devImage) {
        devElement.src = devImage;
        devElement.style.display = 'block';
        devPlaceholder.style.display = 'none';
    } else {
        // Set default Dev image (developer icon)
        devElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9IiMzQjgyRjYiLz4KPHBhdGggZD0iTTE2IDhMMjQgMTZMMTYgMjRMOCAxNkwxNiA4WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTggMTZMMTYgMjRMMTYgOEw4IDE2WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+Cjwvc3ZnPgo=';
        devElement.style.display = 'block';
        devPlaceholder.style.display = 'none';
    }
    
    if (kingImage) {
        const kingElement = document.getElementById('kingAvatar');
        const kingPlaceholder = kingElement.nextElementSibling;
        kingElement.src = kingImage;
        kingElement.style.display = 'block';
        kingPlaceholder.style.display = 'none';
    }
}

// Function to add click functionality to team members
function addTeamClickHandlers() {
    // KingandNFT click handler
    const kingMember = document.querySelector('.team-member:nth-child(2)');
    kingMember.style.cursor = 'pointer';
    kingMember.onclick = function() {
        window.open('https://x.com/KingandNFT', '_blank');
    };
    
    // Add hover effect for KingandNFT
    kingMember.onmouseover = function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
        this.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.5)';
    };
    
    kingMember.onmouseout = function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
    };
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Matrix effect
    new MatrixEffect();
    
    // Initialize sample wallets
    addSampleWallets();
    
    // Check wallet button click
    document.getElementById('checkWallet').addEventListener('click', checkWallet);
    
    // Enter key press in inputs
    document.getElementById('walletAddress').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkWallet();
        }
    });
    
    document.getElementById('xAccount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkWallet();
        }
    });
    
    document.getElementById('season1Points').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkWallet();
        }
    });
    
    document.getElementById('season2Points').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkWallet();
        }
    });
    
    // Focus on wallet input on page load
    document.getElementById('walletAddress').focus();
    
    // Auto-update stats every 30 seconds
    setInterval(() => {
        if (document.getElementById('walletAddress').value.trim() && 
            document.getElementById('xAccount').value.trim() &&
            document.getElementById('season1Points').value.trim() &&
            document.getElementById('season2Points').value.trim()) {
            
            const season1Points = parseInt(document.getElementById('season1Points').value) || 0;
            const season2Points = parseInt(document.getElementById('season2Points').value) || 0;
            
            const rankData = generateRandomRank();
            const statsData = generateRandomStats();
            const seasonRanks = calculateSeasonRanks(season1Points, season2Points);
            const tokenReward = calculateTokenReward(seasonRanks.season1, seasonRanks.season2);
            updateDashboard(rankData, statsData, seasonRanks, tokenReward);
        }
    }, 30000);

    // Load team images on page load
    loadTeamImages();

    // Add team image upload buttons
    addTeamImageUploads();

    // Add click handlers for team members
    addTeamClickHandlers();
}); 