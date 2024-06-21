import React, { useEffect, useRef, useState } from 'react';

const VideoPlayer = () => {
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const loadPlayer = () => {
      const iframe = iframeRef.current;
      if (iframe) {
        const playerInstance = new window.Testpress.Player(iframe);
        setPlayer(playerInstance);

        playerInstance.loaded().then(() => {
          console.log('Player is ready now');
        });

        playerInstance.on('play', () => {
          setIsPlaying(true);
        });

        playerInstance.on('pause', () => {
          setIsPlaying(false);
        });

        playerInstance.on('ended', () => {
          setIsPlaying(false);
          getTotalWatchTime(); // Ensure we capture the final ranges
        });
      }
    };

    if (window.Testpress) {
      loadPlayer();
    } else {
      const script = document.createElement('script');
      script.src = 'https://static.testpress.in/static/js/player.js';
      script.onload = loadPlayer;
      document.body.appendChild(script);
    }

    // Call getTotalWatchTime function every 2 seconds if the player is playing
    const interval = setInterval(() => {
      getTotalWatchTime();
    }, 2000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isPlaying, player]);

  const getTotalWatchTime = () => {
    if (isPlaying && player) {
      player.played().then(function(ranges) {
        let totalWatchTime = 0;
        ranges.forEach(function(range) {
          totalWatchTime += range[1] - range[0];
        });
        console.log('Total watch time:', totalWatchTime.toFixed(2), 'seconds');
      }).catch(function(error) {
        console.error('Error getting played ranges:', error);
      });
    }
  };

  return (
    <iframe
      ref={iframeRef}
      width="560"
      height="315"
      src="https://app.tpstreams.com/embed/dcek2m/996NXydJQDU/?access_token=2ad7cdae-ff2f-4244-bfcb-fcc9f32abd27"
      title="Sample Video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};

export default VideoPlayer;
