AC_INIT([garage_opener], m4_esyscmd([grep version ./server/Cargo.toml | awk '{print $3}' | tr -d '"' | tr -d "\n" | tr -d "{"]), [dollarhidejoel@gmail.com])

VERSION=$(grep version ./server/Cargo.toml | awk '{print $3}' | tr -d '"' | tr -d "\n" | tr -d "{")
AC_SUBST(VERSION)

AC_CONFIG_FILES([
  Makefile
])

AC_OUTPUT
