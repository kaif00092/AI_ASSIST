import { uploadCloudinary } from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/users.model.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;
    if (req.file) {
      assistantImage = await uploadCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);

    const userName = user.name;
    const assistantName = user.assistantName;
    const result = await geminiResponse(command, assistantName, userName);
    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res
        .status(200)
        .json({ response: "sorry i can't understand your request!" });
    }
    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;

    switch (type) {
      case "get_date":
        return res.status(200).json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get_time":
        return res.status(200).json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("hh:mm:ss A")}`,
        });
      case "get_day":
        return res.status(200).json({
          type,
          userInput: gemResult.userInput,
          response: `today  is ${moment().format("dddd ")}`,
        });
      case "get_month":
        return res.status(200).json({
          type,
          userInput: gemResult.userInput,
          response: `current month is ${moment().format("MMMM")}`,
        });

      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "calculator_open":
      case "general":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        return res
          .status(200)
          .json({ response: "Sorry I didn't  understand your command" });
    }
  } catch (error) {
    return res.status(500).json({ response: "asked to assistant error!" });
  }
};
