// PomBase code for JBrowse 2

;(function () {
  class PomBasePlugin {
    install() {}
    configure(pluginManager) {
      const geneValues = (gene) => {
        let so_term_name = gene.get('so_term_name');
        let characterisation_status = gene.get('characterisation_status');
        if (so_term_name === 'protein_coding_gene') {
          return ['protein_coding_gene', characterisation_status];
        } else if (so_term_name.includes("RNA")) {
          return ['RNA', characterisation_status];
        } else {
          return [so_term_name, characterisation_status];
        }
      };
      const getBaseType = (feature) => {
        if (feature.get('type') === 'gene') {
          return geneValues(feature);
        }
        if (feature.get('type') === 'CDS') {
          let transcript = feature.parent();
          if (transcript !== undefined) {
            let gene = transcript.parent();
            if (gene !== undefined) {
              return geneValues(gene);
            }
          }
          return ['other', undefined];
        }

        return ['misc', undefined];
      };
      pluginManager.jexl.addFunction('featureColor', feature => {
        const [baseType, characterisationStatus] = getBaseType(feature);
        if (baseType === 'protein_coding_gene') {
          const colMap = {
            'biological role published': '#ff0000',
            'transposon': '#0000ff',
            'dubious': '#ff00ff',
            'biological role inferred': '#e8ef00',
            'Schizosaccharomyces pombe specific protein, uncharacterized': '#98fb98',
            'conserved unknown': '#ffa500',
            'Schizosaccharomyces specific protein, uncharacterized': '#ffc8c8',
            'pseudogene': '#aaaaaa',
          };
          if (characterisationStatus) {
            return colMap[characterisationStatus] || 'goldenrod';
          } else {
            return 'goldenrod';
          }
        }
        if (baseType === 'RNA') {
          return '#aaa';
        }
        if (baseType === 'misc') {
          return '#4fc2e7';
        }
        return '#8a9';
      });

      pluginManager.jexl.addFunction('featureHeight', feature => {
        const [baseType, _] = getBaseType(feature);
        if (baseType === 'protein_coding_gene') {
          return 12;
        } else {
          return 8;
        }
      });

      pluginManager.jexl.addFunction('featureLabelFontSize', feature => {
        const [baseType, _] = getBaseType(feature);
        if (baseType === 'protein_coding_gene') {
          return 12;
        } else {
          return 9;
        }
      });
    }
  }

  ;(typeof self !== 'undefined' ? self : window).JBrowsePluginPomBasePlugin = {
    default: PomBasePlugin,
  };
})();
