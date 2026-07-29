from app.models.emotion import FusionResult, ActionDecision

class AIDecisionEngine:
    def __init__(self):
        pass

    def decide_action(self, fusion_result: FusionResult) -> ActionDecision:
        emotion = fusion_result.current_emotion.lower()
        engagement = fusion_result.engagement

        if emotion in ["bored", "drowsy"] or engagement < 40.0:
            return ActionDecision(
                action="SPEED_UP",
                reasoning="Low viewer engagement or boredom detected. Increasing video playback speed to 1.25x to maintain focus.",
                speed_multiplier=1.25,
                trigger_modal=False
            )
        elif emotion in ["confused", "puzzled"]:
            return ActionDecision(
                action="SHOW_EXPLANATION",
                reasoning="Facial micro-expression or query indicates confusion. Offering instant AI transcript explanation.",
                speed_multiplier=1.0,
                trigger_modal=True
            )
        elif emotion in ["sad", "depressed", "gloomy"]:
            return ActionDecision(
                action="RECOMMEND_COMEDY",
                reasoning="Sadness detected. Customizing content queue with upbeat comedy recommendations.",
                speed_multiplier=1.0,
                recommendation_query="comedy feelgood hilarity uplifting",
                trigger_modal=False
            )
        elif emotion in ["happy", "excited"]:
            return ActionDecision(
                action="CONTINUE",
                reasoning="Optimal positive viewer state detected. Maintaining current stream parameters.",
                speed_multiplier=1.0,
                trigger_modal=False
            )
        else:
            return ActionDecision(
                action="CONTINUE",
                reasoning="Balanced viewer state. Seamless playback continuing.",
                speed_multiplier=1.0,
                trigger_modal=False
            )
