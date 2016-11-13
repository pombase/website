interface AnnotationType {
    displayName: string;
}

interface AnnotationTypes {
    [annotationTypeName: string]: AnnotationType;
}

export interface GenePageConfig {
    annotationTypes: AnnotationTypes;
    getAnnotationType(annotationTypeName: string): AnnotationType;
}

let _config: GenePageConfig = {
    annotationTypes: {
        cellular_component: {
            displayName: "GO cellular component",
        }
    },
    getAnnotationType:
    function(annotationTypeName: string): AnnotationType {
        return _config.annotationTypes[annotationTypeName];
    },
}

export function getGenePageConfig(): GenePageConfig {
    return _config;
}
