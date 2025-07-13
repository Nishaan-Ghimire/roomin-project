export const propertyIndexMapping = {
  settings: {
    analysis: {
      filter: {
        english_stemmer: {
          type: "stemmer",
          language: "english"
        },
        synonym_filter: {
          type: "synonym",
          synonyms: [
            "home, house, residence",
            "tiny home, micro home, mini house",
            "flat, apartment",
            "wifi, internet"
          ]
        }
      },
      analyzer: {
        custom_english_analyzer: {
          type: "custom",
          tokenizer: "standard",
          filter: ["lowercase", "english_stemmer", "synonym_filter"]
        }
      }
    }
  },
  mappings: {
    properties: {
      title: { type: "text", analyzer: "custom_english_analyzer" },
      city: { type: "text", analyzer: "custom_english_analyzer" },
      landmark: { type: "text", analyzer: "custom_english_analyzer" },
      description: { type: "text", analyzer: "custom_english_analyzer" },
      roomType: { type: "text", analyzer: "custom_english_analyzer" },
      price: { type: "float" },
      status: { type: "keyword" },
      location: {
        properties: {
          lat: { type: "float" },
          long: { type: "float" }
        }
      }
    }
  }
};
