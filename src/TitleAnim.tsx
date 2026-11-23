import { useEffect, useRef } from "react";
import lottie from "lottie-web/build/player/lottie_light";
export default function TitleAnim() {
  return (
    <div className="bus-strip" aria-hidden="true">
      <div className="bus-runner">
        <div
          className="bus-sprite"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}fx/bus-sprite.png)`,
          }}
        />
      </div>
    </div>
  );
}
