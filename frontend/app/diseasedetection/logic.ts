
export const rules: Record<string, Set<string>> = {
  "Saprolegniasis": new Set(["sirip_benang_halus", "insang_benang_halus", "kulit_cerah"]),
  "Aeromoniasis": new Set(["luka_merah", "sirip_rusak", "berenang_tidak_normal"]),
  "Dropsy": new Set(["perut_bengkak", "sisik_mengembang"]),
  "Columnaris": new Set(["sirip_rusak", "bercak_putih", "luka_merah"]),
  "Kutu": new Set(["sirip_bercak_merah", "kulit_gelap", "kulit_pucat", "kulit_luka"]),
  "Myxosporeasis": new Set(["insang_benjolan", "insang_luka", "kulit_gelap", "kulit_luka", "kulit_lendir_berlebihan"]),
  "Bintik Putih": new Set(["sirip_luka", "insang_luka", "kulit_bintik_putih", "kulit_cerah"]),
  "Lerneasis": new Set(["sirip_luka", "insang_luka", "kulit_gelap", "kulit_pucat", "kulit_lendir_berlebihan", "kulit_benang_halus", "mata_luka"]),
  "Aeromonas": new Set(["sirip_rusak", "sirip_bercak_merah", "kulit_melepuh", "kulit_luka", "perut_kembung", "organ_dalam_luka"]),
  "Tuberculosis": new Set(["kulit_gelap", "perut_kembung", "organ_dalam_bintik"]),
  "Pseudomonas": new Set(["sirip_rusak", "sirip_bercak_merah", "sirip_luka", "kulit_gelap", "kulit_luka", "perut_kembung", "mata_menonjol"]),
  "Hervesvirus": new Set(["sirip_luka", "kulit_pucat", "kulit_lendir_berlebihan", "mata_menonjol", "organ_dalam_rusak", "organ_dalam_luka"])
};

export function diagnoseDisease(inputSymptoms: string[]) {
  const symptomsSet = new Set(inputSymptoms);
  const diagnosisResults: { disease: string, match_percentage: number }[] = [];

  for (const [disease, requiredSymptoms] of Object.entries(rules)) {
    const matchCount = [...requiredSymptoms].filter(sym => symptomsSet.has(sym)).length;
    const totalRequired = requiredSymptoms.size;

    if (matchCount > 0) {
      const matchPercentage = parseFloat(((matchCount / totalRequired) * 100).toFixed(2));

      if (matchPercentage > 40) {
        diagnosisResults.push({ disease, match_percentage: matchPercentage });
      }
    }
  }

  diagnosisResults.sort((a, b) => b.match_percentage - a.match_percentage);

  return diagnosisResults.length > 0
    ? { diagnoses: diagnosisResults }
    : { diagnoses: "Tidak ada penyakit dengan kecocokan di atas 50%." };
}
