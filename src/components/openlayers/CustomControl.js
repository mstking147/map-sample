import "ol/ol.css";
import { Control } from "ol/control";

class CustomControl extends Control {
  /**
   * @param {object} [opt_options] {backgroundImage , className} Control options.
   * @param function handleClick fire on click.
   */
  constructor(opt_options, handleClick) {
    const options = opt_options || {};

    const button = document.createElement("button");
    button.style.backgroundImage = options.backgroundImage;
    button.style.backgroundRepeat = "no-repeat";
    button.style.backgroundPosition = "center";

    const element = document.createElement("div");
    element.className = options.className + " ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
    });

    button.addEventListener("click", () => handleClick(), false);
  }
}

export default CustomControl;
