import * as THREE from 'three';
import Tweakpane from 'tweakpane';

import parameterValues from './parameterValues';
import parameterMetadata from './parameterMetadata';

import { simulationUniforms, displayUniforms } from './uniforms';

import { InitialTextureTypes, drawFirstFrame } from './firstFrame';
import { containerSize } from './globals';
import { resetTextureSizes } from '../entry';
import { setupRenderTargets } from './renderTargets';

let pane;
let currentSeedType = InitialTextureTypes.CIRCLE;

export function setupUI() {
  pane = new Tweakpane({ title: 'Parameters' });

  setupReactionDiffusionParameters();
  setupSeedFolder();
  setupRenderingFolder();
  setupCanvasSize();
  setupActions();
}


//==============================================================
//  REACTION-DIFFUSION PARAMETERS
//==============================================================
function setupReactionDiffusionParameters() {
  pane.addInput(parameterValues, 'presets', {
    label: 'Presets',
    options: {
      none: ''
    }
  });

  // f ------------------------------------------
  pane.addInput(parameterValues, 'f', {
    label: 'f',
    min: parameterMetadata.f.min,
    max: parameterMetadata.f.max,
    step: .0001
  })
    .on('change', (value) => {
      simulationUniforms.f.value = value;
    });

  // k ------------------------------------------
  pane.addInput(parameterValues, 'k', {
    label: 'k',
    min: parameterMetadata.k.min,
    max: parameterMetadata.k.max,
    step: .0001
  })
    .on('change', (value) => {
      simulationUniforms.k.value = value;
    });

  // dA -----------------------------------------
  pane.addInput(parameterValues, 'dA', {
    label: 'dA',
    min: parameterMetadata.dA.min,
    max: parameterMetadata.dA.max,
    step: .0001
  }
    ).on('change', (value) => {
      simulationUniforms.dA.value = value;
    });

  // dB -----------------------------------------
  pane.addInput(parameterValues, 'dB', {
    label: 'dB',
    min: parameterMetadata.dB.min,
    max: parameterMetadata.dB.max,
    step: .0001
  })
    .on('change', (value) => {
      simulationUniforms.dB.value = value;
    });

  // Timestep -----------------------------------
  pane.addInput(parameterValues, 'timestep', {
    label: 'Timestep',
    min: parameterMetadata.timestep.min,
    max: parameterMetadata.timestep.max
  })
    .on('change', (value) => {
      simulationUniforms.timestep.value = value;
    });
}


//==============================================================
//  SEED
//==============================================================
function setupSeedFolder() {
  const seedFolder = pane.addFolder({ title: 'Seed pattern' });

  seedFolder.addInput(parameterValues.seed, 'type', {
    label: 'Type',
    options: {
      Circle: InitialTextureTypes.CIRCLE,
      Square: InitialTextureTypes.SQUARE,
      Text: InitialTextureTypes.TEXT,
      Image: InitialTextureTypes.IMAGE,
    }
  })
    .on('change', (value) => {
      currentSeedType = parseInt(value);
      pane.dispose();
      setupUI();
    });

  seedFolder.addButton({
    title: '⟳ Restart with this pattern'
  })
    .on('click', () => {
      drawFirstFrame(currentSeedType);
    });
}


//==============================================================
//  RENDERING
//==============================================================
function setupRenderingFolder() {
  const renderingFolder = pane.addFolder({ title: 'Rendering' });

  renderingFolder.addInput(parameterValues, 'renderingStyle', {
    label: 'Style',
    options: {
      'Gradient': 0,
      'Red Blob Games (original)': 1,
      'Red Blob Games (alt 1)': 2,
      'Red Blob Games (alt 2)': 3,
      'Rainbow': 4,
      'Black and white': 5,
      'Raw': 6
    }
  })
    .on('change', (value) => {
      displayUniforms.renderingStyle.value = value;
      pane.dispose();
      setupUI();
    });

  renderingFolder.addSeparator();

  addRenderingStyleOptions(renderingFolder);
}

  function addRenderingStyleOptions(folder) {
    switch(parseInt(displayUniforms.renderingStyle.value)) {
      case 0:
        addGradientOptions(folder);
        break;

      case 1:
        break;

      case 2:
        break;

      case 3:
        break;

      case 4:
        break;

      case 5:
        break;

      case 6:
        break;

      default:
        console.log('test');
    }
  }

    function addGradientOptions(folder) {
      // Color 1 --------------------------------------------
      folder.addInput(parameterValues.gradientColors, 'color1RGB', { label: 'Color 1' })
        .on('change', (value) => {
          displayUniforms.colorStop1.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop1.value.w);
        });

      folder.addInput(parameterValues.gradientColors, 'color1Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
        .on('change', (value) => { displayUniforms.colorStop1.value.w = value; });

      folder.addInput(parameterValues.gradientColors, 'color1Enabled', { label: 'Enabled' })
        .on('change', (checked) => {
          if(checked) {
            displayUniforms.colorStop1.value = parameterValues.lastColorStop1;
          } else {
            parameterValues.lastColorStop1 = displayUniforms.colorStop1.value;
            displayUniforms.colorStop1.value = new THREE.Vector4(-1, -1, -1, -1);
          }
        });

      folder.addSeparator();

      // Color 2 --------------------------------------------
      folder.addInput(parameterValues.gradientColors, 'color2RGB', { label: 'Color 2' })
        .on('change', (value) => {
          displayUniforms.colorStop2.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop2.value.w);
        });

      folder.addInput(parameterValues.gradientColors, 'color2Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
        .on('change', (value) => { displayUniforms.colorStop2.value.w = value; });

      folder.addInput(parameterValues.gradientColors, 'color2Enabled', { label: 'Enabled' })
        .on('change', (checked) => {
          if(checked) {
            displayUniforms.colorStop2.value = parameterValues.lastColorStop2;
          } else {
            parameterValues.lastColorStop2 = displayUniforms.colorStop2.value;
            displayUniforms.colorStop2.value = new THREE.Vector4(-1, -1, -1, -1);
          }
        });

      folder.addSeparator();

      // Color 3 --------------------------------------------
      folder.addInput(parameterValues.gradientColors, 'color3RGB', { label: 'Color 3' })
        .on('change', (value) => {
          displayUniforms.colorStop3.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop3.value.w);
        });

      folder.addInput(parameterValues.gradientColors, 'color3Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
        .on('change', (value) => { displayUniforms.colorStop3.value.w = value; });

      folder.addInput(parameterValues.gradientColors, 'color3Enabled', { label: 'Enabled' })
        .on('change', (checked) => {
          if(checked) {
            displayUniforms.colorStop3.value = parameterValues.lastColorStop3;
          } else {
            parameterValues.lastColorStop3 = displayUniforms.colorStop3.value;
            displayUniforms.colorStop3.value = new THREE.Vector4(-1, -1, -1, -1);
          }
        });

      folder.addSeparator();

      // Color 4 --------------------------------------------
      folder.addInput(parameterValues.gradientColors, 'color4RGB', { label: 'Color 4' })
        .on('change', (value) => {
          displayUniforms.colorStop4.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop4.value.w);
        });

      folder.addInput(parameterValues.gradientColors, 'color4Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
        .on('change', (value) => { displayUniforms.colorStop4.value.w = value; });

      folder.addInput(parameterValues.gradientColors, 'color4Enabled', { label: 'Enabled' })
        .on('change', (checked) => {
          if(checked) {
            displayUniforms.colorStop4.value = parameterValues.lastColorStop4;
          } else {
            parameterValues.lastColorStop4 = displayUniforms.colorStop4.value;
            displayUniforms.colorStop4.value = new THREE.Vector4(-1, -1, -1, -1);
          }
        });

      folder.addSeparator();

      // Color 5 --------------------------------------------
      folder.addInput(parameterValues.gradientColors, 'color5RGB', { label: 'Color 5' })
        .on('change', (value) => {
          displayUniforms.colorStop5.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop5.value.w);
        });

      folder.addInput(parameterValues.gradientColors, 'color5Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
        .on('change', (value) => { displayUniforms.colorStop5.value.w = value; });

      folder.addInput(parameterValues.gradientColors, 'color5Enabled', { label: 'Enabled' })
        .on('change', (checked) => {
          if(checked) {
            displayUniforms.colorStop5.value = parameterValues.lastColorStop5;
          } else {
            parameterValues.lastColorStop5 = displayUniforms.colorStop5.value;
            displayUniforms.colorStop5.value = new THREE.Vector4(-1, -1, -1, -1);
          }
        });
    }


//==============================================================
//  CANVAS SIZE
//==============================================================
function setupCanvasSize() {
  const canvasSizeFolder = pane.addFolder({ title: 'Canvas size' });

  if(!containerSize.isMaximized) {
    // Width slider ---------------------------------------------------
    canvasSizeFolder.addInput(containerSize, 'width', {
      label: 'Width',
      min: 1,
      max: window.innerWidth,
      step: 1
    })
      .on('change', (value) => {
        containerSize.width = parseInt(value);
        canvas.style.width = containerSize.width + 'px';

        renderer.setSize(containerSize.width, containerSize.height, false);
        camera.aspect = containerSize.width / containerSize.height;
        camera.updateProjectionMatrix();
        setupRenderTargets();
        resetTextureSizes();
        drawFirstFrame(currentSeedType);
      });

    // Height slider ----------------------------------------------------
    canvasSizeFolder.addInput(containerSize, 'height', {
      label: 'Height',
      min: 1,
      max: window.innerHeight,
      step: 1
    })
      .on('change', (value) => {
        containerSize.height = parseInt(value);
        canvas.style.height = containerSize.height + 'px';

        renderer.setSize(containerSize.width, containerSize.height, false);
        camera.aspect = containerSize.width / containerSize.height;
        camera.updateProjectionMatrix();
        setupRenderTargets();
        resetTextureSizes();
        drawFirstFrame(currentSeedType);
      });
  }

  // Maximized checkbox ---------------------------------------------------
  canvasSizeFolder.addInput(containerSize, 'isMaximized', { label: 'Maximize' })
    .on('change', (checked) => {
      if(checked) {
        containerSize._lastWidth = containerSize.width;
        containerSize._lastHeight = containerSize.height;

        containerSize.width = window.innerWidth;
        containerSize.height = window.innerHeight;
      } else {
        containerSize.width = containerSize._lastWidth;
        containerSize.height = containerSize._lastHeight;
      }

      canvas.style.width = containerSize.width + 'px';
      canvas.style.height = containerSize.height + 'px';

      renderer.setSize(containerSize.width, containerSize.height, false);
      camera.aspect = containerSize.width / containerSize.height;
      camera.updateProjectionMatrix();
      setupRenderTargets();
      resetTextureSizes();
      drawFirstFrame(currentSeedType);

      pane.dispose();
      setupUI();
    });
}


//==============================================================
//  ACTIONS
//==============================================================
function setupActions() {
  const actionsFolder = pane.addFolder({ title: 'Actions' });

  actionsFolder.addButton({
    title: '⏸ Pause/play'
  })
    .on('click', () => {
      isPaused = !isPaused;
    });

  actionsFolder.addButton({
    title: '💾 Save as image'
  })
    .on('click', () => {
      let link = document.createElement('a');
      link.download = 'reaction-diffusion.png';
      link.href = renderer.domElement.toDataURL();
      link.click();
    });
}