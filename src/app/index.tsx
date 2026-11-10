import { CardBrief, cardImageUrl, searchCards } from "@/lib/tcgdex";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Index() {
  //verschiedene Zustände
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CardBrief[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Suchfunktion
  async function handleSearch() {
    if (query.trim() === "") return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const cards = await searchCards(query);
      setResults(cards);
    } catch (e) {
      console.error(e);
      setError("Suche fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      <Text>Meine Pokemon Sammlung</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Karte suchen..."
        style={styles.input}
        onSubmitEditing={handleSearch}
      />

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 12 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.image ? (
              <Image
                source={cardImageUrl(item)}
                style={styles.cardImage}
                contentFit="contain"
              />
            ) : (
              <View style={[styles.cardImage, styles.placeholder]} />
            )}
            <View>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardId}>{item.id}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  cardImage: {
    width: 60,
    height: 84,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardId: {
    color: "#888",
  },
  error: {
    color: "red",
    marginTop: 12,
  },
  placeholder: {
    backgroundColor: "gray",
    borderRadius: 4,
  },
});
