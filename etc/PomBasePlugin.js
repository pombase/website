// PomBase code for JBrowse 2

;(function () {
  class PomBasePlugin {
    install() {}
    configure(pluginManager) {
      const getBaseType = (feature) => {
        if (feature.get('type') === 'CDS') {
          let transcript = feature.parent();
          if (transcript !== undefined) {
            let gene = transcript.parent();
            if (gene !== undefined) {
              let so_term_name = gene.get('so_term_name');
              if (so_term_name === 'protein_coding_gene') {
                return 'protein_coding_gene';
              } else if (so_term_name.includes("RNA")) {
                return 'RNA';
              }
            }
          }
          return 'other';
        }

        return 'misc';
      };
      pluginManager.jexl.addFunction('featureColor', feature => {
        const baseType = getBaseType(feature);
        if (baseType === 'protein_coding_gene') {
          return 'goldenrod';
        }
        if (baseType === 'RNA') {
          return '#f44';
        }
        if (baseType === 'misc') {
          return '#4fc2e7';
        }
        return '#8a9';
      });

      pluginManager.jexl.addFunction('featureHeight', feature => {
        const baseType = getBaseType(feature);
        if (baseType === 'protein_coding_gene') {
          return 10;
        } else {
          return 7;
        }
      });

      pluginManager.jexl.addFunction('featureLabelFontSize', feature => {
        const baseType = getBaseType(feature);
        if (baseType === 'protein_coding_gene') {
          return 12;
        } else {
          return 10;
        }
      });
    }
  }

  ;(typeof self !== 'undefined' ? self : window).JBrowsePluginPomBasePlugin = {
    default: PomBasePlugin,
  };
})();
