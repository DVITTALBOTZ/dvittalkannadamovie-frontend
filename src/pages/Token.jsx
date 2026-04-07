import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SEO from "../components/SEO";

import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { Spinner } from "@nextui-org/spinner";
import { v4 as uuidv4 } from "uuid";
import Lottie from "lottie-react";

import happy from "../assets/lotte/happy.json";
import sad from "../assets/lotte/sad.json";

export default function Token() {
  const [loading, setLoading] = useState(true);
  const [tokenCreationStatus, setTokenCreationStatus] = useState(null);
  const [countdown, setCountdown] = useState(8);

  const SHORTNER_TIME = import.meta.env.VITE_SHORTNER_TIME;
  const SITENAME = import.meta.env.VITE_SITENAME;

  const { tokenID } = useParams();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  // 🔍 Fetch user token
  const fetchUserToken = async (userId) => {
    try {
      const userTokenDoc = await getDoc(doc(db, "tokens", userId));
      if (userTokenDoc.exists()) {
        return userTokenDoc.data().token || false;
      }
      return false;
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  };

  // 🔐 Create new token
  const createAndStoreToken = async () => {
    const existingToken = await fetchUserToken(userId);

    if (existingToken === tokenID) {
      const expiresAt = Date.now() + SHORTNER_TIME * 60 * 60 * 1000;

      try {
        const newtoken = uuidv4();

        await setDoc(doc(db, "tokens", userId), {
          token: newtoken,
          expiresAt,
        });

        setTokenCreationStatus(true);
      } catch (error) {
        console.error("Error storing token:", error);
        setTokenCreationStatus(false);
      }
    } else {
      setTokenCreationStatus(false);
    }

    setLoading(false);
  };

  // 🚀 Run token verification
  useEffect(() => {
    if (userId && tokenID) {
      createAndStoreToken();
    }
  }, [userId, tokenID]);

  // ⏳ Countdown + redirect
  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          // 🔁 Redirect to previous page OR home
          const redirectUrl =
            localStorage.getItem("redirectAfterToken") || "/";

          window.location.href = redirectUrl;

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="text-primaryTextColor flex items-center justify-center h-screen px-4">
      <SEO
        title={SITENAME}
        description={`Stream unlimited movies & series on ${SITENAME}`}
        name={SITENAME}
        type="text/html"
        link={`https://${SITENAME}.com`}
      />

      {/* 🔄 Loading */}
      {loading && (
        <Spinner
          label="Verifying your access..."
          labelColor="warning"
          color="warning"
        />
      )}

      {/* ✅ SUCCESS */}
      {!loading && tokenCreationStatus === true && (
        <div className="flex flex-col items-center gap-6 text-center">
          <Lottie animationData={happy} className="w-40" loop autoplay />

          <h1 className="text-xl font-semibold">
            ✅ Verification successful!
          </h1>

          <p className="text-secondaryTextColor">
            Enjoy unlimited downloads for{" "}
            <span className="text-otherColor font-bold">
              {SHORTNER_TIME} hours
            </span>
          </p>

          <p className="text-sm text-gray-400">
            Redirecting in {countdown}s...
          </p>
        </div>
      )}

      {/* ❌ FAILED */}
      {!loading && tokenCreationStatus === false && (
        <div className="flex flex-col items-center gap-6 text-center">
          <Lottie animationData={sad} className="w-40" loop autoplay />

          <h1 className="text-xl font-semibold text-red-400">
            ❌ Verification Failed
          </h1>

          <p className="text-secondaryTextColor">
            Invalid or expired token. Please try again.
          </p>

          <p className="text-sm text-gray-400">
            Closing in {countdown}s...
          </p>
        </div>
      )}
    </div>
  );
      }
