fn main() {
  tonic_build::compile_protos("../proto/garage_opener.proto")
      .unwrap_or_else(|e| panic!("Failed to compile protos {:?}", e));
}
