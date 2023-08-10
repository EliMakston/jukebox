# Group Queue

![current version](https://img.shields.io/badge/version-beta-blue)
![language: JavaScript](https://img.shields.io/badge/language-JavaScript-yellow)

## Description

This is a work-in-progress web app to make a group queue between users of the app. One person starts their music on Spotify, and then can log in, get a room code, and share it with anyone. Anyone with the code can search to add a song to queue.

## Host

_Make sure to start music through Spotify before attempting to host._

Simply select the host option from the home page, login with Spotify, and then allow permissions required by the service. At the top of the screen, you will see a room code that can be shared with anyone. Below that will be a list of the next twenty songs in the queue.

## Join

Input a room code into the text box, then select "Join". After a moment, you will see the next twenty songs that will play, along with a search bar at the top of the screen. Type in the song you want, select it, and it will be added to the next available spot in the queue.

## NOTES

 - Currently, there is not an easy way to visualize where the song will end up in the queue, but it will be near the top.
 - After one hour, the room key will expire, and the host will be required to login again.
