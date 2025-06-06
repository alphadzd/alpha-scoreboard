local QBCore = exports['qb-core']:GetCoreObject()

QBCore.Functions.CreateCallback('qb-scoreboard:server:GetScoreboardData', function(_, cb)
    local totalPlayers = 0
    local policeCount = 0
    local players = {}
    
    for _, v in pairs(QBCore.Functions.GetQBPlayers()) do
        if v then
            totalPlayers += 1
            if v.PlayerData.job.name == 'police' and v.PlayerData.job.onduty then
                policeCount += 1
            end
            players[v.PlayerData.source] = {}
            players[v.PlayerData.source].optin = QBCore.Functions.IsOptin(v.PlayerData.source)
        end
    end
    
    cb(totalPlayers, policeCount, players)
end)

RegisterNetEvent('qb-scoreboard:server:SetActivityBusy', function(activity, bool)
    if not Config.IllegalActions[activity] then return end
    
    Config.IllegalActions[activity].busy = bool
    TriggerClientEvent('qb-scoreboard:client:SetActivityBusy', -1, activity, bool)
    
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if Player then
        local identifier = Player.PlayerData.license
        local name = Player.PlayerData.charinfo.firstname .. ' ' .. Player.PlayerData.charinfo.lastname
        
        print(string.format("[qb-scoreboard] Activity '%s' set to %s by %s (%s)", 
            activity, 
            bool and "busy" or "available", 
            name, 
            identifier
        ))
    end
end)
