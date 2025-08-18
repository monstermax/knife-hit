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
        string url;
    }

    bytes32 public constant GAME_ROLE = keccak256("GAME_ROLE");

    event PlayerDataUpdated(address indexed game, address indexed player, uint256 indexed scoreAmount, uint256 transactionAmount);
    event GameRegistered(address indexed game, string name, string image, string url);
    event GameUnregistered(address indexed game);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    } 

    function registerGame(address _game, string memory _name, string memory _image, string memory _url) public {
        require(games[_game].game == address(0), "Game already registered");
        require(_game != address(0), "Game address cannot be 0");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_image).length > 0, "Image cannot be empty");
        require(bytes(_url).length > 0, "URL cannot be empty");

        _grantRole(GAME_ROLE, _game);
        games[_game] = Game({
            game: _game,
            image: _image,
            name: _name,
            url: _url
        });

        emit GameRegistered(_game, _name, _image, _url);
    }

    function updatePlayerData(address player, uint256 scoreAmount, uint256 transactionAmount) public onlyRole(GAME_ROLE) {
        playerDataPerGame[msg.sender][player].score += scoreAmount;
        playerDataPerGame[msg.sender][player].transactions += transactionAmount;
        totalScoreOfPlayer[player] += scoreAmount;
        totalTransactionsOfPlayer[player] += transactionAmount;

        emit PlayerDataUpdated(msg.sender, player, scoreAmount, transactionAmount);
    }

    function unregisterGame(address game) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(GAME_ROLE, game);
        delete games[game];
        emit GameUnregistered(game);
    }
}
