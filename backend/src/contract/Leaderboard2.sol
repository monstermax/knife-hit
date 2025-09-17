// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract Leaderboard is AccessControl {
    mapping(address => mapping(address => Player)) public playerDataPerGame;
    mapping(address => uint256) public totalScoreOfPlayer;
    mapping(address => uint256) public totalTransactionsOfPlayer;
    mapping(address => Game) public games;

    struct Player {
        uint256 score;
        uint256 transactions;
    }

    struct Game {
        address game;
        string image;
        string name;
        string description;
        string url;
    }
    
    struct PlayerData {
        address player;
        uint256 score;
        uint256 transactions;
    }

    bytes32 public constant GAME_ROLE = keccak256("GAME_ROLE");

    event PlayerDataUpdated(address indexed game, address indexed player, uint256 indexed scoreAmount, uint256 transactionAmount);
    event GameRegistered(address indexed game, string name, string image, string description, string url);
    event GameUnregistered(address indexed game);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    } 

    function registerGame(Game memory _game) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(games[_game.game].game == address(0), "Game already registered");
        require(_game.game != address(0), "Game address cannot be 0");
        require(bytes(_game.name).length > 0, "Name cannot be empty");
        require(bytes(_game.image).length > 0, "Image cannot be empty");
        require(bytes(_game.description).length > 0, "Description cannot be empty");
        require(bytes(_game.url).length > 0, "URL cannot be empty");

        _grantRole(GAME_ROLE, _game.game);
        games[_game.game] = _game;  

        emit GameRegistered(_game.game, _game.name, _game.image, _game.description, _game.url);
    }

    function registerGames(Game[] memory _games) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_games.length > 0, "Games length cannot be 0");
        for (uint256 i = 0; i < _games.length; i++) {
            registerGame(_games[i]);
        }
    }

    function updatePlayerData(PlayerData memory _playerData) public onlyRole(GAME_ROLE) {
        playerDataPerGame[msg.sender][_playerData.player].score += _playerData.score;
        playerDataPerGame[msg.sender][_playerData.player].transactions += _playerData.transactions;
        totalScoreOfPlayer[_playerData.player] += _playerData.score;
        totalTransactionsOfPlayer[_playerData.player] += _playerData.transactions;

        emit PlayerDataUpdated(msg.sender, _playerData.player, _playerData.score, _playerData.transactions);
    }

    function batchUpdatePlayerData(PlayerData[] memory _playerDatas) public onlyRole(GAME_ROLE) {
        require(_playerDatas.length > 0, "Player data length cannot be 0");
        require(games[msg.sender].game != address(0), "Game not registered");
        for (uint256 i = 0; i < _playerDatas.length; i++) {
            updatePlayerData(_playerDatas[i]);
        }
    }

    function unregisterGame(address game) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(GAME_ROLE, game);
        delete games[game];
        emit GameUnregistered(game);
    }
}
