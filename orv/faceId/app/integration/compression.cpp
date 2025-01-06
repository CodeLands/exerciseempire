#include <vector>
#include <string>
#include <iostream>
#include <fstream>
#include <iomanip>
#include <cmath>
#include <cstdint>
#include <chrono>
#include <array>

using namespace std;
using namespace std::chrono;

// Structure to hold compressed RGB data
struct CompressedRGB {
    vector<uint8_t> r, g, b;
};

// BitStream class for writing bits
class BitStream {
    vector<uint8_t> data;
    uint8_t current_byte = 0;
    int bit_position = 0;

public:
    void writeBit(bool bit) {
        current_byte = (current_byte << 1) | bit;
        bit_position++;
        if (bit_position == 8) {
            data.push_back(current_byte);
            current_byte = 0;
            bit_position = 0;
        }
    }

    void writeByte(uint8_t byte) {
        for (int i = 7; i >= 0; i--) {
            writeBit((byte >> i) & 1);
        }
    }

    vector<uint8_t> getData() {
        vector<uint8_t> result = data;
        if (bit_position > 0) {
            current_byte <<= (8 - bit_position);
            result.push_back(current_byte);
        }
        return result;
    }
};

// BitReader class for reading bits
class BitReader {
    const vector<uint8_t>& data;
    size_t byte_position = 0;
    int bit_position = 7;

public:
    BitReader(const vector<uint8_t>& input_data) : data(input_data) {}

    bool readBit() {
        if (byte_position >= data.size()) return false;
        bool bit = (data[byte_position] >> bit_position) & 1;
        if (--bit_position < 0) {
            bit_position = 7;
            byte_position++;
        }
        return bit;
    }

    uint8_t readByte() {
        uint8_t result = 0;
        for (int i = 7; i >= 0; i--)
            result |= (readBit() << i);
        return result;
    }

    int readBits(int numBits) {
        int result = 0;
        for (int i = numBits - 1; i >= 0; i--) {
            result |= (readBit() << i);
        }
        return result;
    }
};

// Set header for compressed data
void setHeader(BitStream& B, int X, int c0, int cn_1, int n) {
    B.writeByte((X >> 8) & 0xFF);
    B.writeByte(X & 0xFF);
    B.writeByte(c0 & 0xFF);
    for (int i = 24; i >= 0; i -= 8) {
        B.writeByte((cn_1 >> i) & 0xFF);
    }
    for (int i = 24; i >= 0; i -= 8) {
        B.writeByte((n >> i) & 0xFF);
    }
}

// Interpolative coding for compression
void IC(BitStream& B, const vector<int>& C, int L, int H) {
    if (H - L > 1 && C[H] != C[L]) {
        int m = (H + L) / 2;
        int g = ceil(log2(C[H] - C[L] + 1));
        for (int i = g - 1; i >= 0; i--) {
            B.writeBit((C[m] - C[L] >> i) & 1);
        }
        if (L < m) IC(B, C, L, m);
        if (m < H) IC(B, C, m, H);
    }
}

// De-Interpolative coding for decompression
void DeIC(BitReader& B, vector<int>& C, int L, int H) {
    if (H - L > 1) {
        if (C[L] == C[H]) {
            for (int i = L + 1; i < H; i++) {
                C[i] = C[L];
            }
        } else {
            int m = (H + L) / 2;
            int g = ceil(log2(C[H] - C[L] + 1));
            int value = B.readBits(g);
            C[m] = C[L] + value;
            if (L < m) DeIC(B, C, L, m);
            if (m < H) DeIC(B, C, m, H);
        }
    }
}

// Compression function for a single channel
vector<uint8_t> compressChannel(const vector<vector<int>>& P) {
    int Y = P.size();
    int X = P[0].size();
    vector<int> E(X * Y);
    E[0] = P[0][0];

    for (int x = 1; x < X; x++) E[x] = P[0][x-1] - P[0][x];
    for (int y = 1; y < Y; y++) E[y * X] = P[y-1][0] - P[y][0];

    for (int y = 1; y < Y; y++) {
        for (int x = 1; x < X; x++) {
            int px_1y = P[y][x-1], pxy_1 = P[y-1][x], px_1y_1 = P[y-1][x-1];
            int prediction;
            if (px_1y_1 >= max(px_1y, pxy_1)) prediction = min(px_1y, pxy_1);
            else if (px_1y_1 <= min(px_1y, pxy_1)) prediction = max(px_1y, pxy_1);
            else prediction = px_1y + pxy_1 - px_1y_1;
            E[y * X + x] = prediction - P[y][x];
        }
    }

    int n = X * Y;
    vector<int> N(n), C(n);
    N[0] = C[0] = E[0];

    for (int i = 1; i < n; i++) {
        N[i] = E[i] >= 0 ? 2 * E[i] : 2 * abs(E[i]) - 1;
        C[i] = C[i-1] + N[i];
    }

    BitStream B;
    setHeader(B, X, C[0], C[n-1], n);
    IC(B, C, 0, n-1);
    return B.getData();
}

// Decompression function for a single channel
vector<vector<int>> decompressChannel(const vector<uint8_t>& compressed_data) {
    BitReader B(compressed_data);
    
    int X = (B.readByte() << 8) | B.readByte();
    int c0 = B.readByte();
    int cn_1 = 0, n = 0;
    
    for (int i = 0; i < 4; i++) cn_1 = (cn_1 << 8) | B.readByte();
    for (int i = 0; i < 4; i++) n = (n << 8) | B.readByte();
    
    int Y = n / X;
    
    vector<int> C(n);
    C[0] = c0;
    C[n-1] = cn_1;
    
    DeIC(B, C, 0, n-1);
    
    vector<int> N(n);
    N[0] = c0;
    for (int i = 1; i < n; i++) N[i] = C[i] - C[i-1];
    
    vector<int> E(n);
    E[0] = N[0];
    for (int i = 1; i < n; i++) E[i] = N[i] % 2 == 0 ? N[i] / 2 : -(N[i] + 1) / 2;
    
    vector<vector<int>> P(Y, vector<int>(X));
    P[0][0] = E[0];
    
    for (int x = 1; x < X; x++) P[0][x] = P[0][x-1] - E[x];
    for (int y = 1; y < Y; y++) P[y][0] = P[y-1][0] - E[y * X];
    
    for (int y = 1; y < Y; y++) {
        for (int x = 1; x < X; x++) {
            int px_1y = P[y][x-1], pxy_1 = P[y-1][x], px_1y_1 = P[y-1][x-1];
            int prediction;
            if (px_1y_1 >= max(px_1y, pxy_1)) prediction = min(px_1y, pxy_1);
            else if (px_1y_1 <= min(px_1y, pxy_1)) prediction = max(px_1y, pxy_1);
            else prediction = px_1y + pxy_1 - px_1y_1;
            P[y][x] = prediction - E[y * X + x];
        }
    }
    
    return P;
}

// Main compression function that takes three matrices
CompressedRGB compressRGBMatrices(const vector<vector<int>>& R,
                                 const vector<vector<int>>& G,
                                 const vector<vector<int>>& B) {
    CompressedRGB result;
    result.r = compressChannel(R);
    result.g = compressChannel(G);
    result.b = compressChannel(B);
    return result;
}

// Main decompression function that returns three matrices
tuple<vector<vector<int>>, vector<vector<int>>, vector<vector<int>>> 
decompressRGBMatrices(const CompressedRGB& compressed) {
    auto R = decompressChannel(compressed.r);
    auto G = decompressChannel(compressed.g);
    auto B = decompressChannel(compressed.b);
    return {R, G, B};
}

// Function to save compressed data to file
void saveCompressedData(const string& filename, const CompressedRGB& compressed) {
    ofstream outfile(filename, ios::binary);
    
    uint32_t r_size = compressed.r.size();
    uint32_t g_size = compressed.g.size();
    uint32_t b_size = compressed.b.size();
    
    outfile.write(reinterpret_cast<const char*>(&r_size), 4);
    outfile.write(reinterpret_cast<const char*>(&g_size), 4);
    outfile.write(reinterpret_cast<const char*>(&b_size), 4);
    
    outfile.write(reinterpret_cast<const char*>(compressed.r.data()), r_size);
    outfile.write(reinterpret_cast<const char*>(compressed.g.data()), g_size);
    outfile.write(reinterpret_cast<const char*>(compressed.b.data()), b_size);
    
    outfile.close();
}

// Function to load compressed data from file
CompressedRGB loadCompressedData(const string& filename) {
    ifstream infile(filename, ios::binary);
    CompressedRGB result;
    
    uint32_t r_size, g_size, b_size;
    infile.read(reinterpret_cast<char*>(&r_size), 4);
    infile.read(reinterpret_cast<char*>(&g_size), 4);
    infile.read(reinterpret_cast<char*>(&b_size), 4);
    
    result.r.resize(r_size);
    result.g.resize(g_size);
    result.b.resize(b_size);
    
    infile.read(reinterpret_cast<char*>(result.r.data()), r_size);
    infile.read(reinterpret_cast<char*>(result.g.data()), g_size);
    infile.read(reinterpret_cast<char*>(result.b.data()), b_size);
    
    infile.close();
    return result;
}