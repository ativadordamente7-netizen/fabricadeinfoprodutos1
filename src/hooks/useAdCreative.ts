import { useState, useEffect } from "react";
import { AdCopyOption, AdImageResponse } from "../../server/adService";
import { CreativeImageGenerator } from "../utils/CreativeImageGenerator";

export interface AdCampaignState {
  productName: string;
  niche: string;
  targetAudience: string;
  tone: string;
  description: string;
  
  // Copies State
  copies: AdCopyOption[];
  selectedCopyType: "recommended" | "emotional" | "direct";
  editedCopies: {
    recommended: AdCopyOption;
    emotional: AdCopyOption;
    direct: AdCopyOption;
  } | null;

  // Images State
  images: {
    commercial: AdImageResponse | null;
    premium: AdImageResponse | null;
    customCover: AdImageResponse | null;
  };
  selectedImageType: "commercial" | "premium" | "customCover";
  selectedImageSize: "1K" | "2K" | "4K";

  // Diagramming and Style State
  fontFamily: "Inter" | "Space Grotesk" | "Playfair Display" | "JetBrains Mono";
  textColor: string;
  overlayStyle: "none" | "dark" | "gradient" | "light" | "colored";
  overlayOpacity: number;
  textAlignment: "left" | "center" | "right";
  textPlacement: "top" | "center" | "bottom";
  showLogoBadge: boolean;
  textFontSize: number; // 14 to 32px relative

  // Traffic Guide and Progress
  isCompleted: boolean;
  currentSubStep: number; // For internal multi-step wizard inside Step 4
}

const DEFAULT_STATE = (productName: string, niche: string, targetAudience: string, tone: string, description: string): AdCampaignState => ({
  productName,
  niche,
  targetAudience,
  tone,
  description,
  copies: [],
  selectedCopyType: "recommended",
  editedCopies: null,
  images: {
    commercial: null,
    premium: null,
    customCover: null
  },
  selectedImageType: "commercial",
  selectedImageSize: "1K",
  fontFamily: "Space Grotesk",
  textColor: "#FFFFFF",
  overlayStyle: "gradient",
  overlayOpacity: 0.6,
  textAlignment: "center",
  textPlacement: "center",
  showLogoBadge: true,
  textFontSize: 18,
  isCompleted: false,
  currentSubStep: 1
});

export function useAdCreative(
  projectId: string,
  sessionToken: string,
  initialData: { 
    productName: string; 
    niche: string; 
    targetAudience: string; 
    tone: string; 
    description: string;
    coverImage?: string;
    initialSubStep?: number;
    systemInstruction?: string;
  }
) {
  const [state, setState] = useState<AdCampaignState>(() => {
    const defaultCoverObj = initialData.coverImage ? {
      imageUrl: initialData.coverImage,
      isFallback: false,
      format: "feed" as const,
      concept: "Capa do E-book",
      style: "customCover" as const
    } : null;

    const local = localStorage.getItem(`ad_campaign_${projectId || "draft"}`);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        // Merge with initial data to keep updated — os dados atuais do projeto (initialData)
        // têm prioridade sobre o que estava salvo, evitando misturar nicho/produto de outro projeto.
        return {
          ...parsed,
          productName: initialData.productName || parsed.productName,
          niche: initialData.niche || parsed.niche,
          targetAudience: initialData.targetAudience || parsed.targetAudience,
          description: initialData.description || parsed.description,
          currentSubStep: initialData.initialSubStep || parsed.currentSubStep || 1,
          images: {
            commercial: parsed.images?.commercial || null,
            premium: parsed.images?.premium || null,
            customCover: parsed.images?.customCover || defaultCoverObj
          }
        };
      } catch (e) {
        // ignore
      }
    }
    const def = DEFAULT_STATE(
      initialData.productName,
      initialData.niche,
      initialData.targetAudience,
      initialData.tone,
      initialData.description
    );
    if (defaultCoverObj) {
      def.images.customCover = defaultCoverObj;
      def.selectedImageType = "customCover";
    }
    if (initialData.initialSubStep) {
      def.currentSubStep = initialData.initialSubStep;
    }
    return def;
  });

  // Sync coverImage if provided later and not set yet
  useEffect(() => {
    if (initialData.coverImage && !state.images.customCover) {
      setState(prev => ({
        ...prev,
        images: {
          ...prev.images,
          customCover: {
            imageUrl: initialData.coverImage!,
            isFallback: false,
            format: "feed"
          }
        }
      }));
    }
  }, [initialData.coverImage]);

  // Sync initialSubStep if specified from parent
  useEffect(() => {
    if (initialData.initialSubStep && initialData.initialSubStep !== state.currentSubStep) {
      setState(prev => ({
        ...prev,
        currentSubStep: initialData.initialSubStep!
      }));
    }
  }, [initialData.initialSubStep]);

  const [loadingCopies, setLoadingCopies] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(`ad_campaign_${projectId || "draft"}`, JSON.stringify(state));
  }, [state, projectId]);

  const updateState = (updater: Partial<AdCampaignState> | ((prev: AdCampaignState) => AdCampaignState)) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  };

  // Generate Ad Copies using backend
  const generateCopies = async () => {
    setLoadingCopies(true);
    setError(null);
    try {
      const res = await fetch("/api/ad/generate-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken
        },
        body: JSON.stringify({
          niche: state.niche,
          description: state.description,
          productName: state.productName,
          targetAudience: state.targetAudience,
          tone: state.tone,
          systemInstruction: initialData.systemInstruction
        })
      });

      if (!res.ok) {
        throw new Error("Falha ao gerar copies de anúncio.");
      }

      const copiesList: AdCopyOption[] = await res.json();
      
      const recom = copiesList.find(c => c.type === "recommended") || copiesList[0];
      const emot = copiesList.find(c => c.type === "emotional") || copiesList[1];
      const dir = copiesList.find(c => c.type === "direct") || copiesList[2];

      updateState({
        copies: copiesList,
        editedCopies: {
          recommended: { ...recom },
          emotional: { ...emot },
          direct: { ...dir }
        }
      });
    } catch (e: any) {
      setError(e.message || "Erro de rede ao falar com a IA.");
    } finally {
      setLoadingCopies(false);
    }
  };

  // Generate Ad Image using backend with local caching
  const generateImage = async (style: "commercial" | "premium" | "customCover", sizeOverride?: "1K" | "2K" | "4K") => {
    setLoadingImage(true);
    setError(null);
    const sizeToUse = sizeOverride || state.selectedImageSize || "1K";
    try {
      // If there is already an active image in the state, it's a regeneration request from the user
      const forceRefresh = !!state.images[style];
      
      const imageResponse = await CreativeImageGenerator.generate({
        niche: state.niche,
        description: state.description,
        productName: state.productName,
        style,
        targetAudience: state.targetAudience,
        imageSize: sizeToUse
      }, sessionToken, forceRefresh);

      updateState((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          [style]: imageResponse
        },
        selectedImageType: style,
        selectedImageSize: sizeToUse
      }));
    } catch (e: any) {
      setError(e.message || "Erro de rede ao conectar com gerador visual.");
    } finally {
      setLoadingImage(false);
    }
  };

  // Generate all 3 cover image options using AI based on eBook title and niche
  const generateAll3Images = async (sizeOverride?: "1K" | "2K" | "4K") => {
    setLoadingImage(true);
    setError(null);
    const sizeToUse = sizeOverride || state.selectedImageSize || "1K";
    try {
      const styles: Array<"commercial" | "premium" | "customCover"> = ["customCover", "commercial", "premium"];
      const newImages = { ...state.images };

      for (const style of styles) {
        const forceRefresh = !!state.images[style];
        const res = await CreativeImageGenerator.generate({
          niche: state.niche,
          description: state.description,
          productName: state.productName,
          style,
          targetAudience: state.targetAudience,
          imageSize: sizeToUse
        }, sessionToken, forceRefresh);
        newImages[style] = res;
      }

      updateState((prev) => ({
        ...prev,
        images: newImages,
        selectedImageType: "customCover",
        selectedImageSize: sizeToUse
      }));
    } catch (e: any) {
      setError(e.message || "Erro de rede ao gerar capas com IA.");
    } finally {
      setLoadingImage(false);
    }
  };

  // Helper to get active selected copy
  const getActiveCopy = (): AdCopyOption | null => {
    if (!state.editedCopies) return null;
    return state.editedCopies[state.selectedCopyType];
  };

  // Helper to get active selected background image
  const getActiveImage = (): AdImageResponse | null => {
    return state.images[state.selectedImageType];
  };

  // Helper to update a specific property of the currently active copy option
  const updateActiveCopyPart = (part: keyof AdCopyOption, value: string) => {
    if (!state.editedCopies) return;
    const currentType = state.selectedCopyType;
    const currentCopy = state.editedCopies[currentType];
    
    const updatedCopy = {
      ...currentCopy,
      [part]: value
    };

    // Recalculate full stitched copy
    if (part !== "primaryText") {
      updatedCopy.primaryText = `🚨 ${updatedCopy.attention}\n\n${updatedCopy.interest}\n\n👉 ${updatedCopy.desire}\n\n👇 ${updatedCopy.action}`;
    }

    updateState((prev) => ({
      ...prev,
      editedCopies: {
        ...prev.editedCopies!,
        [currentType]: updatedCopy
      }
    }));
  };

  return {
    state,
    loadingCopies,
    loadingImage,
    error,
    updateState,
    generateCopies,
    generateImage,
    generateAll3Images,
    getActiveCopy,
    getActiveImage,
    updateActiveCopyPart
  };
}
