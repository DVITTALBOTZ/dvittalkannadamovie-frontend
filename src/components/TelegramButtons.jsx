import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { PiTelegramLogo } from "react-icons/pi";
import axios from "axios";
import { Button } from "@nextui-org/button";
import Spinner from "./svg/Spinner";

const TelegramButton = ({ movieData }) => {
  const USERNAME = import.meta.env.VITE_TG_USERNAME;
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const [loading, setLoading] = useState({});

  // ✅ SHORTLINK FUNCTION (CLEAN)
  const shortenUrl = async (url) => {
    try {
      const res = await axios.get(
        `${API_URL}?api=${API_KEY}&url=${encodeURIComponent(url)}`
      );

      return (
        res.data?.shortenedUrl ||
        res.data?.short ||
        res.data?.url ||
        url
      );
    } catch (err) {
      console.error("Shortlink error:", err);
      return url;
    }
  };

  // ✅ HANDLE CLICK
  const handleClick = async (originalUrl, quality) => {
    setLoading((prev) => ({ ...prev, [quality]: true }));

    try {
      // 🔥 Save page for redirect after token
      localStorage.setItem("redirectAfterToken", window.location.href);

      // 🔥 Generate shortlink
      const shortUrl = await shortenUrl(originalUrl);

      // 🔥 Open shortlink
      window.open(shortUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, [quality]: false }));
    }
  };

  // 🎬 Movie buttons
  const renderMovieButtons = () =>
    movieData.telegram?.map(({ quality }, index) => (
      <Button
        key={index}
        onClick={() =>
          handleClick(
            `https://t.me/${USERNAME}?start=file_${movieData.tmdb_id}_${quality}`,
            quality
          )
        }
        size="sm"
        className="bg-primaryBtn rounded-full"
        isLoading={loading[quality]}
        spinner={<Spinner />}
      >
        {quality}
      </Button>
    ));

  // 📺 Series buttons
  const renderSeasonButtons = () =>
    movieData.seasons.map((season, seasonIndex) => {
      const qualities = new Set();

      season.episodes.forEach((ep) => {
        ep.telegram?.forEach(({ quality }) => qualities.add(quality));
      });

      return (
        <Popover key={seasonIndex} placement="left" showArrow offset={20}>
          <PopoverTrigger>
            <button className="bg-otherColor text-bgColor px-3 py-1 rounded-full">
              Season {season.season_number}
            </button>
          </PopoverTrigger>

          <PopoverContent className="bg-btnColor">
            <div className="flex gap-1 flex-wrap p-2">
              {Array.from(qualities).map((quality, i) => (
                <Button
                  key={i}
                  onClick={() =>
                    handleClick(
                      `https://t.me/${USERNAME}?start=file_${movieData.tmdb_id}_${season.season_number}_${quality}`,
                      quality
                    )
                  }
                  size="sm"
                  className="bg-primaryBtn rounded-full"
                  isLoading={loading[quality]}
                  spinner={<Spinner />}
                >
                  {quality}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      );
    });

  return (
    <Popover placement="bottom" showArrow>
      <PopoverTrigger>
        <button className="flex items-center gap-2 bg-otherColor text-bgColor px-4 py-2 rounded-full text-sm">
          <PiTelegramLogo className="text-lg" />
          Telegram
        </button>
      </PopoverTrigger>

      <PopoverContent className="bg-btnColor">
        <div className="flex flex-col gap-2 p-2">
          {movieData.media_type === "movie"
            ? renderMovieButtons()
            : renderSeasonButtons()}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TelegramButton;
