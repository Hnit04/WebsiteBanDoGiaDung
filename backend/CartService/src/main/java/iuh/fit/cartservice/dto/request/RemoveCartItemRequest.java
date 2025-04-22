package iuh.fit.cartservice.dto.request;

import lombok.Data;

@Data
public class RemoveCartItemRequest {
    private String userId;
    private String productId;
}