#ifndef COMPRESSION_HPP
#define COMPRESSION_HPP

#include <vector>
#include <string>
#include <tuple>
#include <cstdint>

// Structure to hold compressed RGB data
struct CompressedRGB {
    std::vector<uint8_t> r, g, b;
};

// BitStream class for writing bits
class BitStream {
    std::vector<uint8_t> data;
    uint8_t current_byte = 0;
    int bit_position = 0;

public:
    void writeBit(bool bit);
    void writeByte(uint8_t byte);
    std::vector<uint8_t> getData();
};

// BitReader class for reading bits
class BitReader {
    const std::vector<uint8_t>& data;
    size_t byte_position = 0;
    int bit_position = 7;

public:
    BitReader(const std::vector<uint8_t>& input_data);
    bool readBit();
    uint8_t readByte();
    int readBits(int numBits);
};

// Header functions
void setHeader(BitStream& B, int X, int c0, int cn_1, int n);

// Compression functions
void IC(BitStream& B, const std::vector<int>& C, int L, int H);
void DeIC(BitReader& B, std::vector<int>& C, int L, int H);
std::vector<uint8_t> compressChannel(const std::vector<std::vector<int>>& P);
std::vector<std::vector<int>> decompressChannel(const std::vector<uint8_t>& compressed_data);

// Main interface functions
CompressedRGB compressRGBMatrices(const std::vector<std::vector<int>>& R,
                                 const std::vector<std::vector<int>>& G,
                                 const std::vector<std::vector<int>>& B);

std::tuple<std::vector<std::vector<int>>, 
           std::vector<std::vector<int>>, 
           std::vector<std::vector<int>>> 
decompressRGBMatrices(const CompressedRGB& compressed);

// File I/O functions
void saveCompressedData(const std::string& filename, const CompressedRGB& compressed);
CompressedRGB loadCompressedData(const std::string& filename);

#endif // COMPRESSION_HPP