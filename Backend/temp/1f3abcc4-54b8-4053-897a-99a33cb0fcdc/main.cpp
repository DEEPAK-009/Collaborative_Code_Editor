#include <iostream>
#include <vector>
using namespace std;

int main(){
    vector<int> nums = {1,2,3,4};

    cout << "Doubled numbers: ";
    for(int n : nums){
        cout << n*2 << " ";
    }
}