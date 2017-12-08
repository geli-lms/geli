#!/usr/bin/env sh

# FROM https://github.com/warehouseman/semver_shell

red='\033[0;31m'
nc='\033[0m' # No Color

semverParseInto() {
    val="$1";
    if [ "X${val}X" = "XX" ]; then echo "${red}WARN${nc} :: '$val' is not a valid semver"; val="0.0.0"; fi;
    # shellcheck disable=SC2039
    # local RE='[^0-9]*\([0-9]*\)[.]\([0-9]*\)[.]\([0-9]*\)[-]\{0,1\}\([0-9A-Za-z.-]*\)'
    local RE="[^0-9]*\([0-9]\+\)\(\.\([0-9]\+\)\|\)\(\.\([0-9]\+\)\|\)[-]\{0,1\}\([0-9A-Za-z.-]*\)"

    #MAJOR
    eval "$2"="$(echo ${val} | sed -n -e "s#$RE#\1#p")"

    #MINOR
    eval "$3"="$(echo ${val} | sed -n -e "s#$RE#\3#p")"
    eval "$3=\${$3:-0}"

    #PATCH
    eval "$4"="$(echo ${val} | sed -n -e "s#$RE#\5#p")"
    eval "$4=\${$4:-0}"

    #SPECIAL
    eval "$5"="$(echo ${val} | sed -n -e "s#$RE#\6#p")"
}

semverValidate() {

    # shellcheck disable=SC2039
    local M=0
    # shellcheck disable=SC2039
    local m=0
    # shellcheck disable=SC2039
    local p=0
    # shellcheck disable=SC2039
    local s=0
    local CHK=0

    semverParseInto "$1" M m p s
    local RE="^([0-9]*)$";
    CHK=$(echo "${M}"| sed -r "s/${RE}/\1/g");
    if ! [ ${CHK} -ge 0 -a ${CHK} -le 99999999 ] 2>/dev/null; then return 1; fi;
    CHK=$(echo "${m}"| sed -r "s/${RE}/\1/g");
    if ! [ ${CHK} -ge 0 -a ${CHK} -le 99999999 ] 2>/dev/null; then return 1; fi;
    CHK=$(echo "${p}"| sed -r "s/${RE}/\1/g");
    if ! [ ${CHK} -ge 0 -a ${CHK} -le 99999999 ] 2>/dev/null; then return 1; fi;

    return 0;
}

semverConstruct() {
    if [ $# -eq 5 ]; then
        eval "$5=$1.$2.$3-$4"
    fi

    eval "$4=$1.$2.$3"
}

semverCmp() {
    # shellcheck disable=SC2039
    local MAJOR_A=0
    # shellcheck disable=SC2039
    local MINOR_A=0
    # shellcheck disable=SC2039
    local PATCH_A=0
    # shellcheck disable=SC2039
    local SPECIAL_A=0

    # shellcheck disable=SC2039
    local MAJOR_B=0
    # shellcheck disable=SC2039
    local MINOR_B=0
    # shellcheck disable=SC2039
    local PATCH_B=0
    # shellcheck disable=SC2039
    local SPECIAL_B=0

    semverParseInto "$1" MAJOR_A MINOR_A PATCH_A SPECIAL_A
    semverParseInto "$2" MAJOR_B MINOR_B PATCH_B SPECIAL_B

    if [ "X${MAJOR_A}X" = "XX" ]; then echo "${red}WARN${nc} :: '$1' is not a valid semver"; fi;
    if [ "X${MAJOR_B}X" = "XX" ]; then echo "${red}WARN${nc} :: '$2' is not a valid semver"; fi;

    # major
    if [ $MAJOR_A -lt $MAJOR_B ]; then
        return 2
    fi

    if [ $MAJOR_A -gt $MAJOR_B ]; then
        return 1
    fi

    # minor
    if [ $MINOR_A -lt $MINOR_B ]; then
        return 2
    fi

    if [ $MINOR_A -gt $MINOR_B ]; then
        return 1
    fi

    # patch
    if [ $PATCH_A -lt $PATCH_B ]; then
        return 2
    fi

    if [ $PATCH_A -gt $PATCH_B ]; then
        return 1
    fi

    # special
    if [ "$SPECIAL_A" = "" ] && [ "$SPECIAL_B" != "" ]; then
#        echo "C 1  ||  \$SPECIAL_A = $SPECIAL_A, \$SPECIAL_B = $SPECIAL_B";
        return 2 # missing is less than having
    fi

    if [ "$SPECIAL_A" != "" ] && [ "$SPECIAL_B" = "" ]; then
 #       echo "C 2  ||  \$SPECIAL_A = $SPECIAL_A, \$SPECIAL_B = $SPECIAL_B";
        return 1 # having is greater than missing
    fi

    if [ "$(expr "$SPECIAL_A" \< "$SPECIAL_B")" -eq 1 ]; then
        return 2
    fi

    if [ "$(expr "$SPECIAL_A" \> "$SPECIAL_B")" -eq 1 ]; then
        return 1
    fi

    # equal
    return 0
}

semverEQ() {
    semverCmp "$1" "$2"
    # shellcheck disable=SC2039
    local RESULT=$?

    if [ $RESULT -ne 0 ]; then
        # not equal
        return 1
    fi

    return 0
}

semverLT() {
    semverCmp "$1" "$2"
    # shellcheck disable=SC2039
    local RESULT=$?

    if [ $RESULT -ne 2 ]; then
        # not lesser than
        return 1
    fi

    return 0
}

semverGT() {
    semverCmp "$1" "$2"
    # shellcheck disable=SC2039
    local RESULT=$?

    if [ $RESULT -ne 1 ]; then
        # not greater than
        return 1
    fi

    return 0
}

semverLE() {
    semverGT "$1" "$2"
    # shellcheck disable=SC2039
    local RESULT=$?

    if [ $RESULT -ne 1 ]; then
        # not lesser than or equal
        return 1
    fi

    return 0
}

semverGE() {
    semverLT "$1" "$2"
    # shellcheck disable=SC2039
    local RESULT=$?

    if [ $RESULT -ne 1 ]; then
        # not greater than or equal
        return 1
    fi

    return 0
}

semverBumpMajor() {
    # shellcheck disable=SC2039
    local MAJOR=0
    # shellcheck disable=SC2039
    local MINOR=0
    # shellcheck disable=SC2039
    local PATCH=0
    # shellcheck disable=SC2039
    local SPECIAL=""

    semverParseInto "$1" MAJOR MINOR PATCH SPECIAL
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    SPECIAL=""

    semverConstruct $MAJOR $MINOR $PATCH $SPECIAL "$2"
}

semverBumpMinor() {
    # shellcheck disable=SC2039
    local MAJOR=0
    # shellcheck disable=SC2039
    local MINOR=0
    # shellcheck disable=SC2039
    local PATCH=0
    # shellcheck disable=SC2039
    local SPECIAL=""

    semverParseInto "$1" MAJOR MINOR PATCH SPECIAL
    MINOR=$((MINOR + 1))
    PATCH=0
    SPECIAL=""

    semverConstruct $MAJOR $MINOR $PATCH $SPECIAL "$2"
}

semverBumpPatch() {
    # shellcheck disable=SC2039
    local MAJOR=0
    # shellcheck disable=SC2039
    local MINOR=0
    # shellcheck disable=SC2039
    local PATCH=0
    # shellcheck disable=SC2039
    local SPECIAL=""

    semverParseInto "$1" MAJOR MINOR PATCH SPECIAL
    PATCH=$((PATCH + 1))
    SPECIAL=""

    semverConstruct $MAJOR $MINOR $PATCH $SPECIAL "$2"
}

semverStripSpecial() {
    # shellcheck disable=SC2039
    local MAJOR=0
    # shellcheck disable=SC2039
    local MINOR=0
    # shellcheck disable=SC2039
    local PATCH=0
    # shellcheck disable=SC2039
    local SPECIAL=""

    semverParseInto "$1" MAJOR MINOR PATCH SPECIAL
    SPECIAL=""

    semverConstruct $MAJOR $MINOR $PATCH $SPECIAL "$2"
}

if [ "___semver.sh" = "___$(basename "$0")" ]; then
    if [ "$2" = "" ]; then
        echo "$0 <version> <command> [version]"
        echo "Commands: cmp, eq, lt, gt, bump_major, bump_minor, bump_patch, strip_special"
        echo ""
        echo "cmp: compares left version against right version, return 0 if equal, 2 if left is lower than right, 1 if left is higher than right"
        echo "eq: compares left version against right version, returns 0 if both versions are equal"
        echo "lt: compares left version against right version, returns 0 if left version is less than right version"
        echo "gt: compares left version against right version, returns 0 if left version is greater than than right version"
        echo ""
        echo "bump_major: bumps major of version, setting minor and patch to 0, removing special"
        echo "bump_minor: bumps minor of version, setting patch to 0, removing special"
        echo "bump_patch: bumps patch of version, removing special"
        echo ""
        echo "strip_special: strips special from version"
        exit 3
    fi

    if [ "$2" = "cmp" ]; then
        semverCmp "$1" "$3"
        RESULT=$?
        echo $RESULT
        exit $RESULT
    fi

    if [ "$2" = "eq" ]; then
        semverEQ "$1" "$3"
        RESULT=$?
        echo $RESULT
        exit $RESULT
    fi

    if [ "$2" = "lt" ]; then
        semverLT "$1" "$3"
        RESULT=$?
        echo $RESULT
        exit $RESULT
    fi

    if [ "$2" = "gt" ]; then
        semverGT "$1" "$3"
        RESULT=$?
        echo $RESULT
        exit $RESULT
    fi

    if [ "$2" = "le" ]; then
        semverLE "$1" "$3"
        RESULT=$?
        echo $RESULT
        exit $RESULT
    fi

    if [ "$2" = "ge" ]; then
        semverGE "$1" "$3"
        RESULT=$?
        echo $RESULT
        exit $RESULT
    fi

    if [ "$2" = "bump_major" ]; then
        semverBumpMajor "$1" VERSION
        echo "${VERSION}"
        exit 0
    fi

    if [ "$2" = "bump_minor" ]; then
        semverBumpMinor "$1" VERSION
        echo "${VERSION}"
        exit 0
    fi

    if [ "$2" = "bump_patch" ]; then
        semverBumpPatch "$1" VERSION
        echo "${VERSION}"
        exit 0
    fi

    if [ "$2" = "strip_special" ]; then
        semverStripSpecial "$1" VERSION
        echo "${VERSION}"
        exit 0
    fi

    if [ "$2" = "parse" ]; then
        VER=$1;
        shift;
        shift;

        MA=0;
        MI=0;
        PA=0;
        SP="";
        semverParseInto $VER MA MI PA SP;
        eval echo "export \$1=$MA\;";
        eval echo "export \$2=$MI\;";
        eval echo "export \$3=$PA\;";
        eval echo "export \$4=$SP\;";
        echo "";
        exit 0
    fi
fi
