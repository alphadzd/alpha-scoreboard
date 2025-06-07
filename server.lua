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


-- If you want to get more resources, please contact me on discord.
AddEventHandler('onResourceStart', function(resourceName)
    if GetCurrentResourceName() ~= resourceName then return end
    Citizen.SetTimeout(1000, function()
        local p1 = "\27[95m"  
        local p2 = "\27[35m"  
        local p3 = "\27[91m"  
        local p4 = "\27[31m"  
        local white = "\27[97m"
        local reset = "\27[0m"
        print(p1 .. " __        __  ____                 _                                  _   " .. reset)
        print(p1 .. " \\ \\      / / |  _ \\  _____   _____| | ___  _ __  _ __ ___   ___ _ __ | |_ " .. reset)
        print(p2 .. "  \\ \\ /\\ / /  | | | |/ _ \\ \\ / / _ \\ |/ _ \\| '_ \\| '_ ` _ \\ / _ \\ '_ \\| __|" .. reset)
        print(p2 .. "   \\ V  V /   | |_| |  __/\\ V /  __/ | (_) | |_) | | | | | |  __/ | | | |_ " .. reset)
        print(p3 .. "    \\_/\\_/    |____/ \\___| \\_/ \\___|_|\\___/| .__/|_| |_| |_|\\___|_| |_|\\__|" .. reset)
        print(p4 .. "                                           |_|                              " .. reset)
        print(white .. "                 Created by: Alpha" .. reset)
        print(white .. "                 Discord: https://discord.gg/w4dev" .. reset)
        print(white .. "                 If you want to get more resources, please contact me on discord." .. reset)
    end)
end)
