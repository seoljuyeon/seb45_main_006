package WOOMOOL.DevSquad.member.dto;

import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Getter
public class NicknameDto {

    @NotBlank(message = "닉네임을 입력해주세요")
    @Pattern(regexp = "^[A-Za-z0-9가-힣]{2,8}$",
            message = "닉네임은 2~8글자로 이루어져야 합니다.")
    private String nickname;
}
